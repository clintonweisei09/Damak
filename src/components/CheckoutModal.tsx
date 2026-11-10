import React, { useState, useEffect, useRef } from 'react';
import { 
  X, CheckCircle2, MapPin, Clock, 
  ShieldCheck, Printer, ArrowRight, Smartphone, RefreshCw, AlertCircle, 
  Check, Loader2, Sparkles, Phone, Lock, MessageCircle
} from 'lucide-react';
import { CartItem, OrderConfirmation } from '../types/farm';
import { useCurrency } from '../context/CurrencyContext';
import { apiUrl } from '../lib/apiUrl';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  defaultFulfillment: 'pickup' | 'delivery';
  onOrderCompleted: (order: OrderConfirmation) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  defaultFulfillment,
  onOrderCompleted,
}) => {
  const { formatPrice } = useCurrency();
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>(defaultFulfillment);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Turbo, Eldoret, Kenya');
  const [pickupSlot, setPickupSlot] = useState('Saturday 10:00 AM - 1:00 PM');
  const [notes, setNotes] = useState('');
  
  const [mpesaPhone, setMpesaPhone] = useState('');

  // STK Push Progress & Modal State
  const [isStkPromptOpen, setIsStkPromptOpen] = useState(false);
  const [stkStatus, setStkStatus] = useState<'initiating' | 'waiting' | 'timeout' | 'failed' | 'success'>('initiating');
  const [transitStep, setTransitStep] = useState<1 | 2 | 3>(1);
  const [countdown, setCountdown] = useState(60);
  const [stkMessage, setStkMessage] = useState('');
  const [stkError, setStkError] = useState<string | null>(null);
  const [activeReceiptNumber, setActiveReceiptNumber] = useState<string | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const triggerToast = (
    type: 'success' | 'info' | 'error',
    title: string,
    message: string,
    duration = 4500
  ) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };
  
  // Confirmed Order
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);
  const pollingTimerRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);
  const transitStepTimeoutRef = useRef<any>(null);

  // Normalize Kenyan phone to 254XXXXXXXXX
  const cleanKenyanPhone = (raw: string) => {
    let cleaned = raw.replace(/\D/g, '');
    if (cleaned.startsWith('2540')) cleaned = '254' + cleaned.substring(4);
    else if (cleaned.startsWith('0')) cleaned = '254' + cleaned.substring(1);
    else if (cleaned.startsWith('7') || cleaned.startsWith('1')) cleaned = '254' + cleaned;
    return cleaned;
  };
  const activeFormattedPhone = cleanKenyanPhone(mpesaPhone || phone);
  const isPhoneValid = /^254[17]\d{8}$/.test(activeFormattedPhone);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (transitStepTimeoutRef.current) clearTimeout(transitStepTimeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  // Free delivery for orders over 5,000 KSh, or 500 KSh flat
  const shippingFee = fulfillmentType === 'pickup' ? 0 : subtotal >= 5000 ? 0 : 500;
  const total = subtotal + shippingFee;
  const totalInKES = Math.round(total);

  // -------------------------------------------------------------
  // M-Pesa STK Push Initiator (Streamlined & Direct)
  // -------------------------------------------------------------
  const initiateMpesaStkPush = async (
    targetPhone: string,
    orderRef: string = 'DF-HARVEST',
    amountToCharge?: number
  ) => {
    const chosenAmount = amountToCharge !== undefined ? amountToCharge : totalInKES;

    // Clear previous timers
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (transitStepTimeoutRef.current) clearTimeout(transitStepTimeoutRef.current);

    setIsStkPromptOpen(true);
    setStkStatus('initiating');
    setTransitStep(1);
    setStkError(null);
    setCountdown(60);
    setStkMessage('Connecting to Safaricom Daraja API...');

    try {
      const response = await fetch(apiUrl('/api/mpesa/stkpush'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: targetPhone,
          amount: chosenAmount,
          shortcode: '1411049',
          transactionType: 'CustomerPayBillOnline',
          accountReference: 'DAMAKFARM',
          transactionDesc: 'DamakFarm',
        }),
      });

      let data: any;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        throw new Error(rawText || 'Invalid response from payment gateway');
      }

      if (!response.ok || !data.success) {
        setStkStatus('failed');
        const errorMessage = data.error || 'Failed to dispatch M-Pesa STK Push prompt';
        setStkError(errorMessage);
        triggerToast('error', 'Safaricom Notice', errorMessage);
        return;
      }

      // Step 2: Prompt successfully dispatched by Safaricom
      setStkStatus('waiting');
      setTransitStep(2);
      const promptText = data.promptText ||
        data.customerMessage ||
        `Do you want to pay KSh ${chosenAmount.toLocaleString()} to Damak Farm? Enter 4-digit PIN:`;
      setStkMessage(promptText);

      triggerToast(
        'success',
        'STK Push Dispatched!',
        `Prompt sent to +${data.phone || targetPhone}. Enter your 4-digit M-Pesa PIN on your phone.`
      );

      // Step 3 transition: Handset prompt active
      transitStepTimeoutRef.current = setTimeout(() => {
        setTransitStep(3);
      }, 2500);

      // 60-second countdown with automatic timeout trigger
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
            setStkStatus('timeout');
            triggerToast(
              'error',
              'Prompt Timed Out (60s)',
              'No response received. Tap "Retry STK Push Prompt" to send again.'
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Status polling every 3.5 seconds
      const pollQuery = async () => {
        try {
          const queryRes = await fetch(apiUrl(`/api/mpesa/query/${data.checkoutRequestId}`));
          const qContentType = queryRes.headers.get('content-type') || '';
          if (!qContentType.includes('application/json')) return;
          const queryData = await queryRes.json();

          if (queryData.success && queryData.transaction) {
            if (queryData.transaction.status === 'COMPLETED') {
              if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              finalizeMpesaOrder(orderRef, targetPhone, queryData.transaction.receiptNumber);
            } else if (queryData.transaction.status === 'CANCELLED') {
              if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              setStkStatus('failed');
              setStkError(queryData.transaction.resultDesc || 'M-Pesa transaction was cancelled on your phone.');
            } else if (queryData.transaction.status === 'FAILED') {
              if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
              if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              const desc = queryData.transaction.resultDesc || '';
              if (desc.toLowerCase().includes('timed out') || desc.includes('1037')) {
                setStkStatus('timeout');
                setStkError('Safaricom prompt timed out. Phone was locked or took longer than 30 seconds.');
              } else {
                setStkStatus('failed');
                setStkError(desc || 'M-Pesa transaction failed.');
              }
            }
          }
        } catch (e) {
          // Ignore transient polling network drops
        }
      };

      setTimeout(() => {
        pollQuery();
        pollingTimerRef.current = setInterval(pollQuery, 3500);
      }, 4000);

    } catch (err: any) {
      setStkStatus('failed');
      setStkError(err.message || 'Could not reach M-Pesa gateway. Please check phone number and retry.');
    }
  };

  // Finalize order after successful M-Pesa PIN authorization
  const finalizeMpesaOrder = (orderRef: string, paidPhone: string, receiptNo?: string) => {
    setActiveReceiptNumber(receiptNo || null);
    setStkStatus('success');

    triggerToast(
      'success',
      'Payment Authorized & Confirmed!',
      receiptNo ? `M-Pesa Receipt: ${receiptNo}. Your order has been placed!` : 'Safaricom confirmed your payment. Your order has been placed!'
    );

    const newOrder: OrderConfirmation = {
      orderId: orderRef,
      customerName: name,
      email,
      phone,
      fulfillmentType,
      address: fulfillmentType === 'delivery' ? address : undefined,
      pickupSlot: fulfillmentType === 'pickup' ? pickupSlot : undefined,
      notes: notes || undefined,
      paymentMethod: 'mpesa',
      mpesaReceiptNumber: receiptNo,
      mpesaPhone: paidPhone,
      items: [...cartItems],
      subtotal,
      shippingFee,
      total,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setTimeout(() => {
      setIsStkPromptOpen(false);
      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
    }, 1600);
  };

  const handleCancelStk = () => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (transitStepTimeoutRef.current) clearTimeout(transitStepTimeoutRef.current);
    setIsStkPromptOpen(false);
    setStkStatus('initiating');
  };

  // Submit Handler -> Directly triggers M-Pesa STK Push
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    if (fulfillmentType === 'delivery' && !address) return;

    if (!isPhoneValid) {
      triggerToast('error', 'Invalid Phone', 'Enter a valid 9 or 10-digit Kenyan mobile number for the STK Push.');
      return;
    }

    initiateMpesaStkPush(mpesaPhone, `DF-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#FAF8F5] rounded-3xl border-2 border-emerald-400 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-200 flex items-center justify-between bg-gradient-to-r from-emerald-100 via-emerald-50 to-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F6B2C] text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 block">
                Damak Farm · Turbo, Eldoret
              </span>
              <h2 className="font-serif text-xl font-bold text-[#0D381E]">
                {confirmedOrder ? 'Order Confirmed' : 'Lipa Na M-Pesa Checkout'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 text-emerald-900 hover:bg-emerald-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation State with Itemized Receipt */
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-80px)]">
            <div className="text-center py-5 bg-gradient-to-b from-emerald-50 to-[#FCFAF6] rounded-2xl border-2 border-emerald-300 p-4 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-1 animate-in zoom-in-75 duration-300" />
              <h3 className="font-serif text-2xl font-bold text-[#0D381E]">
                Thank You, {confirmedOrder.customerName}!
              </h3>
              <p className="text-xs text-[#2E4735] max-w-md mx-auto leading-relaxed">
                Your order is confirmed and scheduled for morning packing at Damak Farmstead in Turbo.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="px-3 py-1 bg-white border border-emerald-300 rounded-lg font-mono text-xs font-bold text-[#0D381E] shadow-2xs">
                  Order #{confirmedOrder.orderId}
                </span>

                <span className="px-3 py-1 bg-[#0F6B2C] text-white rounded-lg font-mono text-xs font-bold shadow-2xs flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>M-Pesa: {confirmedOrder.mpesaReceiptNumber}</span>
                </span>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-3 text-xs shadow-2xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100">
                <span className="text-[#55695C]">Payment Method:</span>
                <span className="text-[#0F6B2C] font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Lipa Na M-Pesa STK Push ({confirmedOrder.mpesaPhone})</span>
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100">
                <span className="text-[#55695C]">Fulfillment:</span>
                <span className="font-bold text-[#0D381E]">
                  {confirmedOrder.fulfillmentType === 'pickup'
                    ? `Farm Gate Pickup (${confirmedOrder.pickupSlot})`
                    : `Courier Delivery to ${confirmedOrder.address}`}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100">
                <span className="text-[#55695C]">Customer Contact:</span>
                <span className="font-bold text-[#0D381E]">
                  {confirmedOrder.phone} · {confirmedOrder.email}
                </span>
              </div>

              {/* Items summary */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                  Items Ordered
                </span>
                <div className="space-y-1.5 bg-[#FAF8F5] p-3 rounded-xl border border-emerald-100">
                  {confirmedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-[#0D381E] font-medium">
                        {item.quantity}× {item.product.name}
                      </span>
                      <span className="font-mono tabular-nums text-[#0D381E] font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-emerald-100 space-y-1">
                <div className="flex items-center justify-between text-[#55695C]">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums font-bold">
                    {formatPrice(confirmedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#55695C]">
                  <span>Delivery Fee:</span>
                  <span className="font-mono tabular-nums">
                    {confirmedOrder.shippingFee === 0 ? 'FREE' : formatPrice(confirmedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-serif text-base font-bold text-[#0D381E] pt-2 border-t border-emerald-200">
                  <span>Total Paid via M-Pesa:</span>
                  <span className="font-mono text-xl text-[#0F6B2C] font-black">
                    {formatPrice(confirmedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Farm pickup / direct support banner */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-[#2E4735] flex items-center justify-between gap-3">
              <div>
                <span className="font-bold block text-[#0D381E] mb-0.5">
                  Need Fast Assistance?
                </span>
                <p className="text-[11px] text-[#3E5245]">
                  WhatsApp or call Clinton directly at <strong>+254 797 736 534</strong> with Order #{confirmedOrder.orderId}.
                </p>
              </div>
              <a
                href={`https://wa.me/254797736534?text=Hello%20Damak%20Farm,%20I%20have%20paid%20Order%20${confirmedOrder.orderId}%20(M-Pesa%20${confirmedOrder.mpesaReceiptNumber})`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Farmer</span>
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 text-xs font-semibold text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#0F6B2C] hover:bg-[#0A4E20] rounded-xl cursor-pointer shadow-sm"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-80px)]">
            {/* Fulfillment Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-2">
                1. Delivery or Farm Gate Pickup
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('pickup')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    fulfillmentType === 'pickup'
                      ? 'bg-emerald-50 border-[#0F6B2C] text-[#0D381E] font-bold shadow-xs'
                      : 'bg-white border-emerald-200 text-[#4E6738] hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#0F6B2C]" />
                    <span className="font-serif text-sm">Farm Gate Pickup</span>
                  </div>
                  <span className="text-[11px] text-[#55695C] block">
                    Free · Turbo, Eldoret
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    fulfillmentType === 'delivery'
                      ? 'bg-emerald-50 border-[#0F6B2C] text-[#0D381E] font-bold shadow-xs'
                      : 'bg-white border-emerald-200 text-[#4E6738] hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#0F6B2C]" />
                    <span className="font-serif text-sm">Courier Delivery</span>
                  </div>
                  <span className="text-[11px] text-[#55695C] block">
                    {subtotal >= 5000 ? 'Free over ' + formatPrice(5000) : formatPrice(500) + ' flat fee'}
                  </span>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                2. Contact & Delivery Location
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0D381E] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Kipkorir"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-[#0D381E] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0D381E] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. samuel@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-[#0D381E] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-medium"
                  />
                </div>
              </div>

              {fulfillmentType === 'delivery' ? (
                <div>
                  <label className="block text-[11px] font-bold text-[#0D381E] mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Town, Estate, House / Gate Number"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-[#0D381E] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-medium"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-[#0D381E] mb-1">
                    Farm Gate Pickup Slot
                  </label>
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs text-[#0D381E] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-medium"
                  >
                    <option value="Friday 10:00 AM - 1:00 PM">Friday 10:00 AM - 1:00 PM</option>
                    <option value="Friday 2:00 PM - 5:00 PM">Friday 2:00 PM - 5:00 PM</option>
                    <option value="Saturday 10:00 AM - 1:00 PM">Saturday 10:00 AM - 1:00 PM</option>
                    <option value="Saturday 2:00 PM - 5:00 PM">Saturday 2:00 PM - 5:00 PM</option>
                    <option value="Sunday 11:00 AM - 3:00 PM">Sunday 11:00 AM - 3:00 PM</option>
                  </select>
                </div>
              )}
            </div>

            {/* Clean & Vibrant M-Pesa STK Push Section */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-[#EAF8EE] via-[#F2FCF5] to-emerald-50 rounded-2xl border-2 border-[#0F6B2C] shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F6B2C] text-white flex items-center justify-center shadow-xs">
                    <Smartphone className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0F6B2C]">
                      Lipa Na M-Pesa (STK Push)
                    </h3>
                    <span className="text-[11px] text-[#255231] block font-mono">
                      Paybill 1411049 · Damak Farm
                    </span>
                  </div>
                </div>

                <span className="bg-[#0F6B2C] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                  Instant STK Push
                </span>
              </div>

              {/* Phone Number Input with Kenyan Flag */}
              <div>
                <label className="block text-xs font-bold text-[#0D381E] mb-1.5">
                  Enter Safaricom Mobile Number to Receive STK Push:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-extrabold text-emerald-900">
                    🇰🇪 +254
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="07XX XXX XXX"
                    value={mpesaPhone}
                    onChange={(e) => {
                      setMpesaPhone(e.target.value);
                      setPhone(e.target.value);
                    }}
                    className="w-full pl-20 pr-4 py-3 bg-white border-2 border-[#0F6B2C] rounded-xl text-sm font-mono font-bold text-[#0D381E] focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] px-1 pt-1.5">
                  {isPhoneValid ? (
                    <span className="text-[#0F6B2C] font-mono font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready for prompt on +{activeFormattedPhone}</span>
                    </span>
                  ) : (
                    <span className="text-[#55695C] font-mono">
                      Enter your 9 or 10-digit number (e.g. 07XXXXXXXX)
                    </span>
                  )}

                  {/* 1 KSh Handset Probe Test Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const targetPhone = mpesaPhone || phone;
                      if (!targetPhone) return;
                      initiateMpesaStkPush(targetPhone, 'DF-TEST', 1);
                    }}
                    className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Sends an instant 1 KSh prompt to test SIM Toolkit on your handset"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Test 1 KSh on Phone</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white/90 rounded-xl border border-emerald-300 text-xs text-[#255231] space-y-1">
                <div className="font-bold text-[#0F6B2C] flex items-center gap-1">
                  <span>💡 How it works:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  When you tap <strong>Pay via M-Pesa</strong>, Safaricom will immediately display an M-Pesa popup on your phone screen asking you to enter your <strong>4-digit M-Pesa PIN</strong> to pay <strong>KSh {totalInKES.toLocaleString()}</strong> to <strong>Damak Farm (1411049)</strong>.
                </p>
              </div>
            </div>

            {/* Total Summary & Big CTA Button */}
            <div className="p-4 bg-white rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
              <div>
                <span className="text-[#55695C] block">
                  {cartItems.length} items · {fulfillmentType === 'pickup' ? 'Free Farm Pickup' : 'Courier Delivery'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-xl font-black text-[#0D381E]">
                    Total: {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isPhoneValid}
                className="py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-[#0F6B2C] via-[#168538] to-[#0F6B2C] hover:from-[#0A4E20] hover:to-[#0F6B2C] disabled:opacity-50 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98"
              >
                <Smartphone className="w-4 h-4 text-emerald-200" />
                <span>Pay KSh {totalInKES.toLocaleString()} via M-Pesa</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIBRANT & CLEAN SAFARICOM M-PESA STK PUSH PROGRESS DIALOG     */}
      {/* ------------------------------------------------------------- */}
      {isStkPromptOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div 
            className="relative w-full max-w-md bg-[#0B1E11] text-white rounded-3xl border-2 border-[#0F6B2C] shadow-2xl overflow-hidden my-auto p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Safaricom Header Banner */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F6B2C] to-[#1E8A3E] flex items-center justify-center text-white shadow-sm font-black text-lg">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Safaricom M-Pesa</span>
                    {stkStatus === 'timeout' ? (
                      <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded animate-pulse">
                        TIMED OUT
                      </span>
                    ) : stkStatus === 'failed' ? (
                      <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded">
                        FAILED
                      </span>
                    ) : stkStatus === 'success' ? (
                      <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">
                        CONFIRMED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-700 text-emerald-100 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                        <span>LIVE PROMPT</span>
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-emerald-300 block font-mono">
                    Damak Farm (Paybill 1411049) · KSh {totalInKES.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelStk}
                className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STATE 1: IN TRANSIT / LOADING PROGRESS WITH ANIMATIONS        */}
            {/* ------------------------------------------------------------- */}
            {(stkStatus === 'initiating' || stkStatus === 'waiting') && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Progress Card */}
                <div className="bg-[#06140A] p-4 rounded-2xl border border-emerald-600/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span>
                        {transitStep === 1
                          ? '1/3 Connecting to Safaricom...'
                          : transitStep === 2
                          ? '2/3 Prompt sent to your phone!'
                          : '3/3 Enter M-Pesa PIN on handset'}
                      </span>
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-lg border border-emerald-800">
                      ⏳ {countdown}s
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="relative w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-emerald-900">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 transition-all duration-700 ease-out"
                      style={{
                        width: `${
                          transitStep === 1
                            ? 30
                            : transitStep === 2
                            ? 65
                            : Math.min(95, 65 + Math.round(((60 - countdown) / 60) * 30))
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-emerald-400/80 font-mono">
                    <span>Gateway Handshake</span>
                    <span>Prompt Dispatched</span>
                    <span>PIN Authorization</span>
                  </div>
                </div>

                {/* Handset Prompt Display */}
                <div className="bg-[#051108] rounded-2xl border-2 border-emerald-500/70 p-4 shadow-xl space-y-3 text-center">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 border-b border-emerald-800/60 pb-2">
                    <span className="font-bold flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span>CHECK YOUR PHONE</span>
                    </span>
                    <span className="text-white bg-emerald-950 px-2 py-0.5 rounded font-bold">
                      +{activeFormattedPhone}
                    </span>
                  </div>

                  <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-600/40 text-left space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-bold">
                      Message on your screen:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                      {stkMessage || `Do you want to pay KSh ${totalInKES.toLocaleString()} to Damak Farm (1411049) Account DAMAKFARM? Enter PIN:`}
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] text-emerald-300/80 font-mono">M-Pesa PIN:</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse delay-75" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse delay-150" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse delay-200" />
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-200 font-medium">
                    Look at your phone screen now. Enter your 4-digit M-Pesa PIN and press Send.
                  </p>

                  <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-emerald-300/80">Safaricom will confirm your payment automatically.</span>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STATE 2: TIMEOUT STATE WITH PROMINENT RETRY BUTTON            */}
            {/* ------------------------------------------------------------- */}
            {stkStatus === 'timeout' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="p-4 bg-gradient-to-b from-[#2B1706] to-[#170C03] border-2 border-amber-500 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-amber-300 uppercase tracking-wide">
                      M-Pesa Prompt Timed Out (60s)
                    </h4>
                    <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                      Session expired on <strong className="text-white font-mono">+{activeFormattedPhone}</strong>. If your phone screen was locked, unlock it and tap Retry.
                    </p>
                  </div>
                </div>

                {/* Primary Retry Button */}
                <button
                  type="button"
                  onClick={() => {
                    const targetPhone = mpesaPhone || phone;
                    initiateMpesaStkPush(targetPhone, 'DF-HARVEST', totalInKES);
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-xl cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-98 border border-emerald-400"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                  <span>Retry STK Push Prompt (KSh {totalInKES.toLocaleString()})</span>
                </button>

                {/* Manual Paybill Instructions */}
                <div className="p-3 bg-[#07170B] border border-emerald-700/60 rounded-2xl text-xs space-y-2">
                  <span className="text-[11px] font-bold text-emerald-300 block">
                    Phone prompt didn&apos;t show? Pay directly from M-Pesa Menu:
                  </span>
                  <div className="p-2.5 bg-black/60 rounded-xl border border-emerald-800 text-[11px] font-mono text-emerald-200 space-y-1">
                    <div>1. Lipa na M-Pesa &gt; <strong>Pay Bill</strong></div>
                    <div>2. Business Number: <strong className="text-amber-300">1411049</strong></div>
                    <div>3. Account Number: <strong className="text-amber-300">DAMAKFARM</strong></div>
                    <div>4. Amount: <strong className="text-emerald-300">KSh {totalInKES.toLocaleString()}</strong> &amp; Enter PIN</div>
                  </div>

                  <p className="text-[10px] text-emerald-300/80">Manual payments are not confirmed here. Wait for the STK Push status or retry the prompt.</p>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STATE 3: FAILED STATE WITH RETRY                              */}
            {/* ------------------------------------------------------------- */}
            {stkStatus === 'failed' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="p-4 bg-gradient-to-b from-[#2B0A0A] to-[#170505] border-2 border-rose-500 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-rose-300">
                      Payment Notice
                    </h4>
                    <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
                      {stkError || 'Could not complete M-Pesa prompt.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const targetPhone = mpesaPhone || phone;
                    initiateMpesaStkPush(targetPhone, 'DF-HARVEST', totalInKES);
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry STK Push Prompt</span>
                </button>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STATE 4: SUCCESS STATE                                        */}
            {/* ------------------------------------------------------------- */}
            {stkStatus === 'success' && (
              <div className="p-5 bg-gradient-to-b from-[#0F3819] to-[#08200E] border-2 border-emerald-400 rounded-2xl text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Payment Authorized!</h4>
                  <p className="text-xs text-emerald-200 mt-1">
                    {activeReceiptNumber ? <>Safaricom Receipt: <strong>{activeReceiptNumber}</strong></> : 'Safaricom confirmed your payment.'}
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60 text-xs">
              <button
                type="button"
                onClick={handleCancelStk}
                className="py-1.5 px-3 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <span className="text-[10px] text-emerald-400/80 font-mono">
                Safaricom Paybill 1411049
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-80 max-w-md w-[92%] sm:w-auto animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-auto">
          <div
            className={`p-3.5 sm:p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#0E3D1D]/95 border-emerald-400 text-white'
                : toast.type === 'error'
                ? 'bg-red-950/95 border-red-500 text-white'
                : 'bg-[#0B2516]/95 border-emerald-500 text-white'
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-500 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <AlertCircle className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 pr-1">
              <h4 className="font-bold text-xs sm:text-sm text-white">
                {toast.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-emerald-100/90 leading-relaxed mt-0.5">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-emerald-200/70 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
