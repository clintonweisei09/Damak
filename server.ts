import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

const allowedOrigins = new Set(
  (process.env.FRONTEND_URL || 'https://clintonweisei09.github.io')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use((req, res, next) => {
  const origin = req.get('Origin');
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.vary('Origin');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(origin && !allowedOrigins.has(origin) ? 403 : 204);
  }

  next();
});

app.use(express.json());

const mpesaEnvironment = (process.env.MPESA_ENVIRONMENT || 'sandbox').trim().toLowerCase();
if (mpesaEnvironment !== 'sandbox' && mpesaEnvironment !== 'production') {
  throw new Error('MPESA_ENVIRONMENT must be either "sandbox" or "production".');
}

const mpesaConfig = {
  consumerKey: (process.env.MPESA_CONSUMER_KEY || '').trim(),
  consumerSecret: (process.env.MPESA_CONSUMER_SECRET || '').trim(),
  passkey: (process.env.MPESA_PASSKEY || '').trim(),
  shortcode: (process.env.MPESA_SHORTCODE || '1411049').trim(),
  environment: mpesaEnvironment,
  businessName: (process.env.MPESA_BUSINESS_NAME || 'Damak Farm').trim(),
  accountReference: 'DFHARVEST',
};

function getShortcodeConfig(requestedShortcode?: unknown): typeof mpesaConfig {
  const requestedCode = typeof requestedShortcode === 'string' ? requestedShortcode.trim() : '';
  if (requestedCode && requestedCode !== mpesaConfig.shortcode) {
    throw new Error(`Shortcode ${requestedCode} is not configured.`);
  }
  return mpesaConfig;
}

function getCallbackUrl() {
  const appUrl = (process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || '').trim().replace(/\/+$/, '');
  if (!appUrl) return null;

  try {
    const url = new URL(appUrl);
    if (url.protocol !== 'https:' || url.hostname === 'localhost') return null;
    return `${appUrl}/api/mpesa/callback`;
  } catch {
    return null;
  }
}

function hasMpesaCredentials() {
  return Boolean(
    mpesaConfig.consumerKey &&
    mpesaConfig.consumerSecret &&
    mpesaConfig.passkey &&
    mpesaConfig.shortcode
  );
}

// In-memory transaction state store for STK push status checks
interface MpesaTransaction {
  checkoutRequestId: string;
  merchantRequestId?: string;
  amount: number;
  phone: string;
  accountRef: string;
  shortcode: string;
  transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  storeNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  resultDesc?: string;
  receiptNumber?: string;
  timestamp: string;
  source: 'daraja_live' | 'simulation';
}

const transactions = new Map<string, MpesaTransaction>();

/**
 * Format phone to standard Kenyan Safaricom international format: 254XXXXXXXXX
 */
function formatKenyanPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('2540')) {
    cleaned = '254' + cleaned.substring(4);
  } else if (cleaned.startsWith('254')) {
    // Already has international prefix
  } else if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

/**
 * Generate Timestamp format YYYYMMDDHHmmss using East Africa Time (Africa/Nairobi UTC+3)
 * to strictly match Safaricom Daraja server clocks.
 */
function getMpesaTimestamp(): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${get('second')}`;
}

const tokenCache = new Map<string, { token: string; expiresAt: number }>();

/**
 * Generate OAuth Bearer Token from Daraja (cached per Consumer Key)
 */
async function getDarajaAccessToken(consumerKey: string, consumerSecret: string): Promise<string> {
  const cached = tokenCache.get(consumerKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.token;
  }

  if (!consumerKey || !consumerSecret) {
    throw new Error('M-Pesa Consumer Key and Consumer Secret are not configured.');
  }

  const authUrl =
    mpesaConfig.environment === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const res = await fetch(authUrl, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authHeader}`,
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    console.log(`[M-Pesa Gateway Notice] Safaricom live authentication returned status ${res.status}`);
    throw new Error(`Safaricom authentication returned status ${res.status}`);
  }

  const data = await res.json();
  const expiresInSeconds = parseInt(data.expires_in || '3599', 10);
  const token = typeof data.access_token === 'string' ? data.access_token : '';
  if (!token) {
    throw new Error(data.errorMessage || 'Safaricom authentication response did not include an access token.');
  }
  tokenCache.set(consumerKey, {
    token,
    expiresAt: Date.now() + Math.max(60, expiresInSeconds - 120) * 1000,
  });

  return token;
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Health & Config Check
app.get('/api/mpesa/status', (req, res) => {
  const callbackUrl = getCallbackUrl();
  const isConfigured = hasMpesaCredentials();

  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: isConfigured ? 'online' : 'credentials_pending',
    environment: mpesaConfig.environment,
    shortcode: mpesaConfig.shortcode,
    registeredName: mpesaConfig.businessName,
    availableShortcodes: [mpesaConfig.shortcode],
    accountReference: mpesaConfig.accountReference,
    callbackUrl,
    callbackConfigured: Boolean(callbackUrl),
    configured: isConfigured,
  });
});

// Diagnostic endpoint to view recent STK push attempts and Safaricom responses
app.get('/api/mpesa/debug-recent', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const list = Array.from(transactions.values()).slice(-10).reverse();
  res.json({
    count: transactions.size,
    transactions: list,
  });
});

// Initiate Lipa Na M-Pesa STK Push
app.post('/api/mpesa/stkpush', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const {
      phone,
      amount,
      accountReference,
      transactionDesc,
      transactionType,
      storeNumber,
      shortcode: requestedShortcode,
    } = req.body;

    if (!phone || amount === undefined || amount === null || amount === '') {
      return res.status(400).json({
        success: false,
        error: 'Phone number and amount are required',
      });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number of at least KSh 1.',
      });
    }

    const formattedPhone = formatKenyanPhone(phone);
    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      return res.status(400).json({
        success: false,
        error: `Invalid phone number (${phone}). Please provide a valid 9 or 10-digit Kenyan Safaricom line (e.g. 07XXXXXXXX or 01XXXXXXXX)`,
      });
    }

    let config: typeof mpesaConfig;
    try {
      config = getShortcodeConfig(requestedShortcode);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Requested shortcode is not configured.',
      });
    }
    if (!hasMpesaCredentials()) {
      return res.status(503).json({
        success: false,
        error: 'M-Pesa credentials are not configured. Set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY, and MPESA_SHORTCODE on the server.',
      });
    }

    const callbackUrl = getCallbackUrl();
    if (!callbackUrl) {
      return res.status(503).json({
        success: false,
        error: 'Set APP_URL to the public HTTPS URL of this app so Safaricom can reach the payment callback.',
      });
    }

    const numericAmount = Math.round(parsedAmount);
    const effectiveStoreNumber = (storeNumber || process.env.MPESA_STORE_NUMBER || '').trim();

    // In Daraja, single shortcodes like 1411049 work as CustomerPayBillOnline
    const selectedType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline' =
      transactionType === 'CustomerBuyGoodsOnline' && Boolean(effectiveStoreNumber)
        ? 'CustomerBuyGoodsOnline'
        : 'CustomerPayBillOnline';

    const timestamp = getMpesaTimestamp();
    const shortcode = config.shortcode;
    const passkey = config.passkey;
    const isBuyGoods = selectedType === 'CustomerBuyGoodsOnline';

    const businessShortCode = isBuyGoods && effectiveStoreNumber ? effectiveStoreNumber : shortcode;
    const partyB = shortcode;
    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');

    const shortcodeDisplay = shortcode;
    const businessNameDisplay = config.businessName;

    const formattedPrompt = isBuyGoods
      ? `Do you want to buy goods KSh ${numericAmount.toLocaleString()} to ${businessNameDisplay} (Till ${shortcodeDisplay})?`
      : `Do you want to pay KSh ${numericAmount.toLocaleString()} to ${businessNameDisplay} (Paybill ${shortcodeDisplay}) Account ${accountReference || 'DF-HARVEST'}?`;

    // Step 1: Obtain Access Token using this shortcode's specific credentials
    const accessToken = await getDarajaAccessToken(config.consumerKey, config.consumerSecret);

    // Step 2: Call Safaricom STK Push
    const stkUrl =
      mpesaConfig.environment === 'production'
        ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    const sanitizedAccountRef = (accountReference || 'DFHARVEST')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 12) || 'DFHARVEST';
    const sanitizedDesc = (transactionDesc || 'DamakFarm').replace(/[^a-zA-Z0-9]/g, '').slice(0, 13) || 'DamakFarm';

    const payload = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: selectedType,
      Amount: numericAmount,
      PartyA: formattedPhone,
      PartyB: partyB,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: sanitizedAccountRef,
      TransactionDesc: sanitizedDesc,
    };

    console.log(`[Daraja STK Push] Sending ${selectedType} for KSh ${numericAmount} to phone ${formattedPhone} (Shortcode: ${shortcode})...`);

    const stkRes = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const darajaData: any = await stkRes.json();
    console.log(`[Daraja STK Push] Response status ${stkRes.status}:`, JSON.stringify(darajaData));

    if (!stkRes.ok || darajaData.ResponseCode !== '0' || !darajaData.CheckoutRequestID) {
      const errDescription =
        darajaData.errorMessage ||
        darajaData.ResponseDescription ||
        `Safaricom rejected request (Status ${darajaData.ResponseCode || stkRes.status})`;

      console.error('[Daraja STK Push Error]', errDescription);

      return res.status(400).json({
        success: false,
        error: errDescription,
        raw: darajaData,
        phone: formattedPhone,
        amount: numericAmount,
        transactionType: selectedType,
        shortcode: shortcodeDisplay,
      });
    }

    // Safaricom accepted request for dispatch to handset
    const checkoutRequestId = darajaData.CheckoutRequestID;
    const transactionRecord: MpesaTransaction = {
      checkoutRequestId,
      merchantRequestId: darajaData.MerchantRequestID,
      amount: numericAmount,
      phone: formattedPhone,
      accountRef: sanitizedAccountRef,
      shortcode,
      transactionType: selectedType,
      storeNumber: effectiveStoreNumber || undefined,
      status: 'PENDING',
      resultDesc: darajaData.CustomerMessage || `STK push dispatched to ${formattedPhone}. Awaiting M-Pesa PIN input.`,
      timestamp: new Date().toISOString(),
      source: 'daraja_live',
    };

    transactions.set(checkoutRequestId, transactionRecord);

    return res.status(200).json({
      success: true,
      checkoutRequestId,
      merchantRequestId: darajaData.MerchantRequestID,
      responseCode: darajaData.ResponseCode,
      responseDescription: darajaData.ResponseDescription,
      customerMessage: darajaData.CustomerMessage || formattedPrompt,
      promptText: formattedPrompt,
      phone: formattedPhone,
      amount: numericAmount,
      shortcode: shortcodeDisplay,
      registeredName: businessNameDisplay,
      transactionType: selectedType,
      accountReference: sanitizedAccountRef,
      source: 'daraja_live',
    });
  } catch (err: any) {
    console.error('[Daraja STK Gateway Exception]:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal payment gateway error connecting to Safaricom',
    });
  }
});

// Safaricom Webhook Callback GET Ping (For connectivity verification)
app.get('/api/mpesa/callback', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const callbackUrl = getCallbackUrl();

  return res.status(200).json({
    success: true,
    status: 'active',
    endpoint: '/api/mpesa/callback',
    environment: mpesaConfig.environment,
    shortcode: mpesaConfig.shortcode,
    registeredName: mpesaConfig.businessName,
    accountReference: 'DF-HARVEST',
    callbackUrl,
    timestamp: new Date().toISOString(),
  });
});

// Safaricom Webhook Callback Endpoint
app.post('/api/mpesa/callback', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  try {
    const callbackData = req.body?.Body?.stkCallback;
    if (callbackData) {
      const checkoutRequestId = callbackData.CheckoutRequestID;
      const resultCode = callbackData.ResultCode;
      const resultDesc = callbackData.ResultDesc;

      const record = transactions.get(checkoutRequestId);
      if (record) {
        if (resultCode === 0) {
          record.status = 'COMPLETED';
          record.resultDesc = resultDesc;
          // Extract receipt from Item array
          const items = callbackData.CallbackMetadata?.Item || [];
          const receiptItem = items.find((i: any) => i.Name === 'MpesaReceiptNumber');
          if (receiptItem) {
            record.receiptNumber = receiptItem.Value;
          }
        } else if (resultCode === 1032) {
          record.status = 'CANCELLED';
          record.resultDesc = 'User cancelled the transaction';
        } else {
          record.status = 'FAILED';
          record.resultDesc = resultDesc || 'Transaction failed';
        }
      }
    }
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (e: any) {
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Handled' });
  }
});

// Poll Transaction Status (with Live Safaricom Daraja STK Push Query)
app.get('/api/mpesa/query/:checkoutRequestId', async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const { checkoutRequestId } = req.params;
  const record = transactions.get(checkoutRequestId);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found',
    });
  }

  let config: typeof mpesaConfig;
  try {
    config = getShortcodeConfig(record.shortcode);
  } catch {
    return res.status(500).json({ success: false, error: 'Transaction shortcode configuration changed.' });
  }

  // If still pending and live daraja transaction, query live Safaricom Daraja STK Query API
  if (record.status === 'PENDING' && record.source === 'daraja_live' && hasMpesaCredentials()) {
    try {
      const accessToken = await getDarajaAccessToken(config.consumerKey, config.consumerSecret);
      const timestamp = getMpesaTimestamp();
      const isBuyGoods = record.transactionType === 'CustomerBuyGoodsOnline';
      const queryShortCode = isBuyGoods && record.storeNumber
        ? record.storeNumber
        : config.shortcode;

      const password = Buffer.from(
        `${queryShortCode}${config.passkey}${timestamp}`
      ).toString('base64');

      const isProduction = mpesaConfig.environment === 'production';
      const queryUrl = isProduction
        ? 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
        : 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

      const qRes = await fetch(queryUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: queryShortCode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (qRes.ok) {
        const qData = await qRes.json();
        const resultCodeStr = String(qData.ResultCode ?? '');
        console.log(`[Daraja Query] ${checkoutRequestId} ResultCode=${resultCodeStr}: ${qData.ResultDesc}`);

        if (resultCodeStr === '0') {
          // Success! User entered PIN and transaction cleared
          record.status = 'COMPLETED';
          record.resultDesc = qData.ResultDesc || 'The service request is processed successfully.';
        } else if (resultCodeStr === '1032') {
          // User explicitly cancelled the prompt on handset
          record.status = 'CANCELLED';
          record.resultDesc = 'Request was cancelled by user on phone.';
        } else if (resultCodeStr === '2001') {
          // User entered incorrect PIN on handset
          record.status = 'FAILED';
          record.resultDesc = 'Incorrect M-Pesa PIN entered on handset.';
        } else if (resultCodeStr === '1') {
          // User has insufficient funds
          record.status = 'FAILED';
          record.resultDesc = 'Insufficient M-Pesa account balance.';
        } else if (resultCodeStr === '11') {
          record.status = 'FAILED';
          record.resultDesc = 'Safaricom reported: DebitParty in invalid state. Please ensure the phone is an active Safaricom line with active M-Pesa, or switch between Paybill and Till.';
        } else if (qData.ResultDesc && qData.ResultDesc.includes('Store number')) {
          record.status = 'FAILED';
          record.resultDesc = 'Safaricom note: 1242385 requires Paybill mode. Please switch to Paybill 1242385 and tap Retry.';
        } else if (resultCodeStr === '1037') {
          // Handset prompt timed out or phone was unreachable
          record.status = 'FAILED';
          record.resultDesc = 'STK prompt timed out: Phone screen was locked/unreachable or response took over 30s (ResultCode 1037).';
        } else if (
          resultCodeStr === '2029' ||
          resultCodeStr === '4999' ||
          resultCodeStr === '1001' ||
          !resultCodeStr
        ) {
          // In-transit / USSD session active / waiting for PIN input / network resolution
          record.resultDesc = 'Prompt sent. Waiting for customer to enter 4-digit M-Pesa PIN...';
        } else {
          record.status = 'FAILED';
          record.resultDesc = qData.ResultDesc || 'Transaction failed';
        }
      } else {
        const errorJson: any = await qRes.json().catch(() => null);
        console.log(`[Daraja Query] ${checkoutRequestId} HTTP ${qRes.status}:`, errorJson);
        if (
          errorJson?.errorMessage?.includes('being processed') ||
          errorJson?.ResponseDescription?.includes('being processed')
        ) {
          record.resultDesc = 'Handset prompt active. Awaiting your 4-digit M-Pesa PIN...';
        }
      }
    } catch (e: any) {
      // Keep pending if query takes long or is in transit
    }
  }

  return res.json({
    success: true,
    transaction: record,
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Damak Farm full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
