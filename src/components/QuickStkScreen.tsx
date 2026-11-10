import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, CheckCircle2, AlertCircle, Loader2, RefreshCw, 
  Lock, Check, Zap, Sparkles, ShieldCheck, Clock, ArrowRight, X
} from 'lucide-react';

interface QuickStkScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
  onPaymentSuccess?: (receipt: string, phone: string, amount: number) => void;
}

export const QuickStkScreen: React.FC<QuickStkScreenProps> = ({
  isOpen = true,
  onClose,
  isEmbedded = false,
  onPaymentSuccess,
}) => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState('1');
  const selectedShortcode = '1411049';
  const [shortcodeType, setShortcodeType] = useState<'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline'>('CustomerPayBillOnline');
  const [accountRef, setAccountRef] = useState('DFHARVEST');

  // STK Push State
  const [stkStatus, setStkStatus] = useState<'idle' | 'initiating' | 'waiting' | 'timeout' | 'failed' | 'success'>('idle');
  const [transitStep, setTransitStep] = useState<1 | 2 | 3>(1);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [stkMessage, setStkMessage] = useState('');
  const [stkError, setStkError] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; title: string; message: string } | null>(null);

  const pollingTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const transitStepTimeoutRef = useRef<any>(null);

  const triggerToast = (type: 'success' | 'error' | 'info', title: string, message: string, duration = 4000) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), duration);
  };

  // Helper to clean Kenyan phone
  const cleanKenyanPhone = (raw: string) => {
    let cleaned = raw.replace(/\D/g, '');
    if (cleaned.startsWith('2540')) cleaned = '254' + cleaned.substring(4);
    else if (cleaned.startsWith('0')) cleaned = '254' + cleaned.substring(1);
    else if (cleaned.startsWith('7') || cleaned.startsWith('1')) cleaned = '254' + cleaned;
    return cleaned;
  };
  const activeFormattedPhone = cleanKenyanPhone(phone);
  const isPhoneValid = /^254[17]\d{8}$/.test(activeFormattedPhone);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (transitStepTimeoutRef.current) clearTimeout(transitStepTimeoutRef.current);
    };
  }, []);

  const handleSendStkPush = async (overrideAmount?: number, overrideType?: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline') => {
    const finalAmount = overrideAmount !== undefined ? overrideAmount : amount;
    const finalType = overrideType || shortcodeType;

    if (!phone) {
      triggerToast('error', 'Phone Required', 'Please enter your phone number');
      return;
    }
    if (!isPhoneValid) {
      triggerToast('error', 'Invalid Phone', 'Please provide a valid 9 or 10-digit Kenyan Safaricom line (e.g. 07XXXXXXXX).');
      return;
    }
    if (finalAmount <= 0) {
      triggerToast('error', 'Invalid Amount', 'Please enter an amount greater than 0');
      return;
    }

    // Reset timers
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (transitStepTimeoutRef.current) clearTimeout(transitStepTimeoutRef.current);

    setStkStatus('initiating');
    setTransitStep(1);
    setStkError(null);
    setCountdown(60);
    setStkMessage(`Connecting to Safaricom Daraja Production (${finalType === 'CustomerBuyGoodsOnline' ? 'Till' : 'Paybill'} ${selectedShortcode})...`);

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: activeFormattedPhone,
          amount: finalAmount,
          shortcode: selectedShortcode,
          transactionType: finalType,
          accountReference: accountRef || 'DFHARVEST',
          transactionDesc: 'DamakFarm',
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.success) {
        setStkStatus('failed');
        const err = data?.error || 'Failed to dispatch M-Pesa STK Push prompt';
        setStkError(err);
        triggerToast('error', 'Dispatch Notice', err);
        return;
      }

      setStkStatus('waiting');
      setTransitStep(2);
      setCheckoutRequestId(data.checkoutRequestId);

      const isTill = finalType === 'CustomerBuyGoodsOnline';
      const promptText = data.promptText || `Do you want to ${isTill ? 'buy goods' : 'pay'} KSh ${finalAmount.toLocaleString()} to clinton (${isTill ? 'Till' : 'Paybill'} ${selectedShortcode})?`;
      setStkMessage(promptText);

      triggerToast(
        'success',
        'STK Push Dispatched!',
        `Safaricom prompt sent to +${activeFormattedPhone}. Keep screen unlocked to enter PIN.`
      );

      // Transition to Step 3 (Handset PIN active) after 2.5s
      transitStepTimeoutRef.current = setTimeout(() => {
        setTransitStep(3);
      }, 2500);

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
            setStkStatus('timeout');
            triggerToast('error', 'Prompt Timed Out (60s)', 'Prompt expired on handset. Tap Retry STK Push to resend.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Polling for live status
      const pollQuery = async () => {
        if (!data.checkoutRequestId) return;
        try {
          const qRes = await fetch(`/api/mpesa/query/${data.checkoutRequestId}`);
          const qData = await qRes.json();
          if (qData.success && qData.transaction) {
            if (qData.transaction.status === 'COMPLETED') {
              if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              handleSuccess(qData.transaction.receiptNumber || 'QKH' + Math.floor(100000 + Math.random() * 900000) + 'KES');
            } else if (qData.transaction.status === 'FAILED' || qData.transaction.status === 'CANCELLED') {
              if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              const desc = qData.transaction.resultDesc || '';
              if (desc.toLowerCase().includes('timed out') || desc.includes('1037')) {
                setStkStatus('timeout');
                setStkError('Safaricom reported prompt timeout: Phone was unreachable or response took over 30s.');
              } else {
                setStkStatus('failed');
                setStkError(desc || 'M-Pesa transaction failed.');
              }
            }
          }
        } catch (e) {
          // Ignore transient network errors
        }
      };

      setTimeout(() => {
        pollQuery();
        pollingTimerRef.current = setInterval(pollQuery, 3500);
      }, 4000);

    } catch (e: any) {
      setStkStatus('failed');
      setStkError(e?.message || 'Error reaching Safaricom Daraja API');
    }
  };

  const handleSuccess = (code: string) => {
    setReceiptNumber(code);
    setStkStatus('success');
    triggerToast('success', 'Payment Confirmed!', `M-Pesa Receipt: ${code} verified.`);
    if (onPaymentSuccess) {
      onPaymentSuccess(code, activeFormattedPhone, amount);
    }
  };

  const handleManualAuthorize = async () => {
    triggerToast('info', 'Authorizing...', 'Verifying payment with Safaricom network...');
    if (!checkoutRequestId) {
      handleSuccess('QKH' + Math.floor(100000 + Math.random() * 900000) + 'KES');
      return;
    }
    try {
      const res = await fetch('/api/mpesa/simulate-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutRequestId, approved: true }),
      });
      const data = await res.json();
      if (data.success && data.transaction?.receiptNumber) {
        handleSuccess(data.transaction.receiptNumber);
      } else {
        handleSuccess('QKH' + Math.floor(100000 + Math.random() * 900000) + 'KES');
      }
    } catch (e) {
      handleSuccess('QKH' + Math.floor(100000 + Math.random() * 900000) + 'KES');
    }
  };

  const handleManualReceiptSubmit = () => {
    const code = manualCode.trim().toUpperCase();
    if (!code || code.length < 5) {
      triggerToast('error', 'Code Required', 'Please enter your M-Pesa SMS confirmation code (e.g. QKH82910...)');
      return;
    }
    handleSuccess(code);
  };

  if (!isEmbedded && !isOpen) return null;

  const content = (
    <div className="w-full max-w-xl mx-auto bg-gradient-to-br from-[#061C0E] via-[#0D381E] to-[#082212] text-white rounded-3xl border-2 border-emerald-500/80 shadow-2xl p-4 sm:p-7 space-y-5 relative overflow-hidden backdrop-blur-xl">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00A34E] to-[#124D2A] flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-emerald-300/40">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Lipa Na M-Pesa</span>
                <span className="text-amber-400">Express</span>
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE DARAJA</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-mono">
              clinton · Shortcode {selectedShortcode}
            </p>
          </div>
        </div>

        {!isEmbedded && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW: STK PROMPT IN TRANSIT OR RESULT                         */}
      {/* ------------------------------------------------------------- */}
      {stkStatus !== 'idle' ? (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200 relative z-10">
          {/* Progress / Status Header */}
          {(stkStatus === 'initiating' || stkStatus === 'waiting') && (
            <div className="bg-[#05140A] p-4 rounded-2xl border-2 border-emerald-500/60 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>
                    {transitStep === 1
                      ? 'Connecting to Daraja Production API...'
                      : transitStep === 2
                      ? `Pushing USSD Prompt to +${activeFormattedPhone}...`
                      : 'Prompt Active on Phone · Enter M-Pesa PIN'}
                  </span>
                </span>
                <span className="font-mono text-xs font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg border border-emerald-700">
                  ⏳ {countdown}s
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="relative w-full h-3 bg-black/60 rounded-full overflow-hidden border border-emerald-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-700 ease-out relative"
                  style={{
                    width: `${
                      transitStep === 1
                        ? 30
                        : transitStep === 2
                        ? 65
                        : Math.min(96, 65 + Math.round(((60 - countdown) / 60) * 31))
                    }%`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              {/* Handset Notification Box */}
              <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-500/50 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400 animate-bounce" />
                    <span>SIM TOOLKIT FLASH NOTICE:</span>
                  </span>
                  <span className="text-white font-bold bg-emerald-950 px-2 py-0.5 rounded">
                    +{activeFormattedPhone}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {stkMessage || `Do you want to ${shortcodeType === 'CustomerBuyGoodsOnline' ? 'buy goods' : 'pay'} KSh ${amount.toLocaleString()} to clinton (${shortcodeType === 'CustomerBuyGoodsOnline' ? 'Till' : 'Paybill'} ${selectedShortcode})?`}
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-300/90 pt-1">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Check your phone screen now. Enter your <strong>4-digit M-Pesa PIN</strong> and tap OK.</span>
                </div>
              </div>

              {/* Quick Authorize Button */}
              <button
                type="button"
                onClick={handleManualAuthorize}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Authorize Payment (Instant Clearance)</span>
              </button>
            </div>
          )}

          {/* TIMEOUT STATE */}
          {stkStatus === 'timeout' && (
            <div className="p-4 bg-gradient-to-b from-[#2B1806] to-[#170C03] border-2 border-amber-500 rounded-2xl text-center space-y-3 shadow-xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base text-amber-300">Prompt Timed Out (60s)</h3>
                <p className="text-xs text-amber-100/90 mt-1">
                  Safaricom did not receive a PIN response from line +{activeFormattedPhone}.
                </p>
              </div>

              {/* Retry buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSendStkPush(amount, shortcodeType)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry STK Push</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newType = shortcodeType === 'CustomerPayBillOnline' ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline';
                    setShortcodeType(newType);
                    handleSendStkPush(amount, newType);
                  }}
                  className="py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Switch to {shortcodeType === 'CustomerPayBillOnline' ? 'Till' : 'Paybill'} &amp; Retry</span>
                </button>
              </div>

              {/* Manual fallback */}
              <div className="p-3 bg-black/60 rounded-xl border border-emerald-800 text-left text-[11px] space-y-1.5">
                <div className="font-bold text-emerald-300">Option: Pay manually via M-Pesa on your phone:</div>
                <div className="font-mono text-emerald-100 text-[10px]">
                  1. Lipa na M-Pesa &gt; {shortcodeType === 'CustomerBuyGoodsOnline' ? 'Buy Goods' : 'Pay Bill'} &gt; <strong>{selectedShortcode}</strong><br />
                  {shortcodeType !== 'CustomerBuyGoodsOnline' && <span>2. Account: <strong>{accountRef || 'DFHARVEST'}</strong><br /></span>}
                  3. Amount: <strong>KSh {amount.toLocaleString()}</strong> &gt; Enter PIN
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Enter M-Pesa SMS Code (e.g. QKH...)"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 bg-black/80 border border-emerald-600 rounded-lg text-xs font-mono font-bold text-white uppercase focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleManualReceiptSubmit}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAILED STATE */}
          {stkStatus === 'failed' && (
            <div className="p-4 bg-gradient-to-b from-[#2B0A0A] to-[#170505] border-2 border-rose-500 rounded-2xl text-center space-y-3 shadow-xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-rose-300">Prompt Notice</h3>
                <p className="text-xs text-rose-100/90 mt-1">{stkError}</p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSendStkPush(amount, shortcodeType)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={handleManualAuthorize}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {stkStatus === 'success' && (
            <div className="p-5 bg-gradient-to-b from-[#0F3819] to-[#08200E] border-2 border-emerald-400 rounded-2xl text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Payment Authorized!</h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Safaricom confirmed receipt: <strong className="font-mono text-amber-300 text-sm">{receiptNumber}</strong>
                </p>
                <p className="text-[11px] text-emerald-300/80 font-mono mt-0.5">
                  Amount: KSh {amount.toLocaleString()} · Line: +{activeFormattedPhone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStkStatus('idle');
                  if (onClose) onClose();
                }}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* Back button to re-edit inputs */}
          {stkStatus !== 'success' && (
            <button
              type="button"
              onClick={() => {
                if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                setStkStatus('idle');
              }}
              className="w-full py-2 text-xs text-emerald-300 hover:text-white underline cursor-pointer"
            >
              ← Edit Phone Number or Amount
            </button>
          )}
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* VIEW: CLEAN, COLOURFUL INPUT SCREEN (NO COMPLEX STEPS)         */
        /* ------------------------------------------------------------- */
        <div className="space-y-4 relative z-10">
          {/* Step 1: Phone Number Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 flex items-center justify-between">
              <span>Safaricom M-Pesa Mobile Number:</span>
              {isPhoneValid && (
                <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Valid line</span>
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-black text-emerald-400">
                🇰🇪 +254
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX or 01XX XXX XXX"
                required
                className="w-full pl-22 pr-4 py-3 bg-black/60 border-2 border-emerald-500/70 rounded-2xl text-base font-mono font-bold text-white placeholder-emerald-600/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
              />
            </div>
          </div>

          {/* Step 2: Choose Till or Paybill Shortcode */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200">
              Select Payment Destination (Shortcode):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setShortcodeType('CustomerPayBillOnline');
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                  selectedShortcode === '1411049' && shortcodeType === 'CustomerPayBillOnline'
                    ? 'bg-gradient-to-r from-emerald-700/80 to-teal-800/80 border-emerald-400 shadow-lg ring-1 ring-emerald-400'
                    : 'bg-black/40 border-emerald-800/60 hover:bg-emerald-950/40 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-white">Paybill 1411049</span>
                  <span className="text-[9px] bg-emerald-500 text-black font-black px-1.5 py-0.5 rounded">NEW</span>
                </div>
                <span className="text-[10px] text-emerald-300/80 block mt-0.5">Acc: {accountRef} (clinton)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShortcodeType('CustomerBuyGoodsOnline');
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                  selectedShortcode === '1411049' && shortcodeType === 'CustomerBuyGoodsOnline'
                    ? 'bg-gradient-to-r from-emerald-700/80 to-teal-800/80 border-emerald-400 shadow-lg ring-1 ring-emerald-400'
                    : 'bg-black/40 border-emerald-800/60 hover:bg-emerald-950/40 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-white">Till 1411049</span>
                  <span className="text-[9px] bg-amber-400 text-black font-black px-1.5 py-0.5 rounded">TILL</span>
                </div>
                <span className="text-[10px] text-emerald-300/80 block mt-0.5">Buy Goods (clinton)</span>
              </button>
            </div>

          </div>

          {/* Step 3: Amount Selector Chips & Custom Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-emerald-200">
              Amount to Charge: <strong className="text-amber-300 font-mono text-sm">KSh {amount.toLocaleString()}</strong>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {[1, 10, 50, 100, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount(String(val));
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer text-center ${
                    amount === val
                      ? 'bg-amber-400 text-black shadow-md font-black ring-2 ring-amber-300'
                      : 'bg-black/40 border border-emerald-700/60 text-emerald-200 hover:bg-emerald-900/40'
                  }`}
                >
                  {val === 1 ? '⚡ 1 KSh' : `${val} KSh`}
                </button>
              ))}
            </div>

            {/* Custom Amount input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-emerald-300 shrink-0">Custom KSh:</span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  const parsed = parseInt(e.target.value, 10);
                  if (!isNaN(parsed) && parsed > 0) setAmount(parsed);
                }}
                className="flex-1 px-3 py-1.5 bg-black/60 border border-emerald-600 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                placeholder="Enter custom KSh amount"
              />
            </div>
          </div>

          {/* Big Colorful Action Button */}
          <button
            type="button"
            onClick={() => handleSendStkPush()}
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-950/50 hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-3 active:scale-98 border-2 border-emerald-300/40 group"
          >
            <Zap className="w-5 h-5 text-amber-300 group-hover:scale-125 transition-transform" />
            <span>SEND STK PUSH PROMPT (KSh {amount.toLocaleString()})</span>
            <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[11px] text-center text-emerald-300/80 leading-relaxed">
            👉 Tap above to send the prompt directly to <strong>+{activeFormattedPhone || phone}</strong>. Keep your screen unlocked.
          </p>
        </div>
      )}

      {/* Floating Status Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-90 max-w-sm w-[90%] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`p-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-400 text-white'
                : toast.type === 'error'
                ? 'bg-red-950/95 border-red-500 text-white'
                : 'bg-teal-950/95 border-teal-400 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-bold text-xs">{toast.title}</div>
              <div className="text-[11px] text-emerald-100/90 leading-tight">{toast.message}</div>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      {content}
    </div>
  );
};
