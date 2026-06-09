import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, CreditCard, Banknote, QrCode, Loader2, Gift, Zap, BadgeCheck, Sparkles } from 'lucide-react';
import { getInvoiceQrDetails, collectPayment } from '../../services/invoiceService';
import { activateContract } from '../../services/contractService';
import { createVNPayUrl, getPaymentStatus } from '../../../payment/services/vnpayService';

// Unified Payment Drawer
// Handles displaying the invoice amount, QR code, and processing payment + activation
const UnifiedPaymentDrawer = ({
  isOpen,
  onClose,
  invoiceId,
  contractId,
  totalAmountDue,
  invoiceCode,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [qrDetails, setQrDetails] = useState(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('payment'); // 'payment', 'success'
  const [error, setError] = useState(null);

  // VNPay Integration States
  const [vnpayUrl, setVnpayUrl] = useState(null);
  const [pollStatus, setPollStatus] = useState(null); // null | 'checking' | 'paid' | 'failed' | 'expired'
  const pollIntervalRef = useRef(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Reset state when drawer opens with a new invoice
  useEffect(() => {
    if (isOpen && invoiceId) {
      setStep('payment');
      setError(null);
      setPaymentMethod('Cash');
      setVnpayUrl(null);
      setPollStatus(null);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      fetchQrCode(invoiceId);
    }
  }, [isOpen, invoiceId]);

  const fetchQrCode = async (id) => {
    try {
      setIsLoadingQr(true);
      const data = await getInvoiceQrDetails(id);
      if (data) {
        setQrDetails(data);
      }
    } catch (err) {
      console.error("Failed to load QR details:", err);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleClose = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    onClose();
  };

  const handleConfirmPayment = async () => {
    if (!invoiceId || !contractId) {
      setError("Missing invoice or contract information.");
      return;
    }

    // VNPay Specific Flow
    if (paymentMethod === 'VNPay') {
      try {
        setIsProcessing(true);
        setError(null);
        setPollStatus('checking');

        const result = await createVNPayUrl(invoiceId);
        if (result && result.paymentUrl) {
          setVnpayUrl(result.paymentUrl);
          window.open(result.paymentUrl, '_blank');

          // Start status polling
          let attempts = 0;
          const maxAttempts = 100; // 100 * 3s = 5 minutes

          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
          }

          pollIntervalRef.current = setInterval(async () => {
            attempts++;
            try {
              const statusData = await getPaymentStatus(invoiceId);
              if (statusData?.status === 'Completed') {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
                setPollStatus('paid');
                setStep('success');
                setIsProcessing(false);
                setTimeout(() => {
                  if (onSuccess) onSuccess();
                }, 2500);
              } else if (statusData?.status === 'Failed' || statusData?.status === 'Cancelled') {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
                setPollStatus('failed');
                setIsProcessing(false);
              } else if (statusData?.status === 'Expired') {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
                setPollStatus('expired');
                setIsProcessing(false);
              }
            } catch (pollErr) {
              console.error("Polling status error:", pollErr);
            }

            if (attempts >= maxAttempts) {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              setPollStatus('failed');
              setIsProcessing(false);
              setError("Hết thời gian chờ thanh toán VNPay.");
            }
          }, 3000);
        } else {
          throw new Error("Không thể khởi tạo URL thanh toán VNPay");
        }
      } catch (err) {
        console.error("VNPay payment creation failed:", err);
        setError(err.message || "Không thể khởi tạo thanh toán VNPay.");
        setPollStatus(null);
        setIsProcessing(false);
      }
      return;
    }

    // Regular Cash/Card/BankTransfer Flow
    try {
      setIsProcessing(true);
      setError(null);

      // Step 1: Collect Payment
      await collectPayment(invoiceId, {
        amount: totalAmountDue,
        method: paymentMethod,
        refNo: `PAY-${invoiceCode || (invoiceId ? invoiceId.toString().substring(0, 8) : 'TEMP')}`
      });

      // Step 2: Activate Contract
      await activateContract(contractId);

      // Step 3: Show Success State
      setStep('success');

      // Call onSuccess callback after a short delay so user sees the success state
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2500);

    } catch (err) {
      console.error("Payment flow failed:", err);
      setError(err.response?.data?.message || "An error occurred during payment processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isProcessing ? handleClose : undefined}
      ></div>

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 flex flex-col"
        style={{ color: '#475569' }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-850" style={{ color: '#0f172a' }}>
            Thanh toán & Kích hoạt
          </h2>
          <button
            onClick={handleClose}
            disabled={isProcessing && paymentMethod !== 'VNPay'} // Allow closing during VNPay poll
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-white">
          {step === 'payment' && (
            <div className="p-6 space-y-6">

              {/* Invoice Summary */}
              <div
                className="rounded-xl p-4 border border-indigo-100/80"
                style={{
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #e8f0fe 100%)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 mb-0.5">
                  Tổng tiền thanh toán
                </p>
                <p
                  className="text-2xl font-extrabold mb-2.5"
                  style={{ color: '#1e1b4b' }}
                >
                  {formatCurrency(totalAmountDue)}
                </p>
                <div className="flex justify-between items-center text-[11px] pt-2 border-t border-indigo-200/40">
                  <span className="text-indigo-650 font-medium">Mã hóa đơn:</span>
                  <span className="font-bold px-1.5 py-0.5 bg-white/60 rounded text-indigo-900">
                    {invoiceCode || 'N/A'}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs border border-red-100">
                  {error}
                </div>
              )}

              {/* Free Package Banner */}
              {totalAmountDue === 0 && (
                <div
                  className="rounded-xl p-4 border border-emerald-200 flex items-start gap-3 animate-in fade-in"
                  style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    <Gift size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 text-sm">Gói dùng thử miễn phí!</p>
                    <p className="text-emerald-700 text-xs mt-1 leading-relaxed">
                      Không cần thanh toán. Nhấn "Kích hoạt ngay" để cấp thẻ tập cho hội viên.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Methods — chỉ hiển thị khi có phí */}
              {totalAmountDue > 0 && (
                <div>
                  <h3 className="text-[9px] font-bold mb-2 uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                    Phương thức thanh toán
                  </h3>
                  <div className="grid gap-2">
                    {/* Cash */}
                    <label
                      className={`relative flex cursor-pointer rounded-lg border py-2.5 px-3.5 transition-all duration-200 ${paymentMethod === 'Cash'
                          ? 'border-indigo-600 ring-2 ring-indigo-650/15'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                      style={{
                        backgroundColor: paymentMethod === 'Cash' ? '#f0f4ff' : '#ffffff',
                        color: paymentMethod === 'Cash' ? '#4f46e5' : '#475569'
                      }}
                    >
                      <input type="radio" name="paymentMethod" value="Cash" className="sr-only" checked={paymentMethod === 'Cash'} onChange={() => { setPaymentMethod('Cash'); setPollStatus(null); }} />
                      <span className="flex flex-1 items-center gap-2.5">
                        <Banknote size={16} className={paymentMethod === 'Cash' ? 'text-indigo-600' : 'text-slate-400'} />
                        <span className="text-xs font-semibold">
                          Tiền mặt
                        </span>
                      </span>
                      <CheckCircle className={`h-4.5 w-4.5 ${paymentMethod === 'Cash' ? 'text-indigo-600' : 'text-transparent'}`} />
                    </label>

                    {/* Card */}
                    <label
                      className={`relative flex cursor-pointer rounded-lg border py-2.5 px-3.5 transition-all duration-200 ${paymentMethod === 'Card'
                          ? 'border-indigo-600 ring-2 ring-indigo-650/15'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                      style={{
                        backgroundColor: paymentMethod === 'Card' ? '#f0f4ff' : '#ffffff',
                        color: paymentMethod === 'Card' ? '#4f46e5' : '#475569'
                      }}
                    >
                      <input type="radio" name="paymentMethod" value="Card" className="sr-only" checked={paymentMethod === 'Card'} onChange={() => { setPaymentMethod('Card'); setPollStatus(null); }} />
                      <span className="flex flex-1 items-center gap-2.5">
                        <CreditCard size={16} className={paymentMethod === 'Card' ? 'text-indigo-600' : 'text-slate-400'} />
                        <span className="text-xs font-semibold">
                          Quẹt thẻ (POS)
                        </span>
                      </span>
                      <CheckCircle className={`h-4.5 w-4.5 ${paymentMethod === 'Card' ? 'text-indigo-600' : 'text-transparent'}`} />
                    </label>

                    {/* Transfer / VietQR */}
                    <label
                      className={`relative flex cursor-pointer rounded-lg border py-2.5 px-3.5 transition-all duration-200 ${paymentMethod === 'BankTransfer'
                          ? 'border-indigo-600 ring-2 ring-indigo-650/15'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                      style={{
                        backgroundColor: paymentMethod === 'BankTransfer' ? '#f0f4ff' : '#ffffff',
                        color: paymentMethod === 'BankTransfer' ? '#4f46e5' : '#475569'
                      }}
                    >
                      <input type="radio" name="paymentMethod" value="BankTransfer" className="sr-only" checked={paymentMethod === 'BankTransfer'} onChange={() => { setPaymentMethod('BankTransfer'); setPollStatus(null); }} />
                      <span className="flex flex-1 items-center gap-2.5">
                        <QrCode size={16} className={paymentMethod === 'BankTransfer' ? 'text-indigo-600' : 'text-slate-400'} />
                        <span className="text-xs font-semibold">
                          Chuyển khoản / VietQR
                        </span>
                      </span>
                      <CheckCircle className={`h-4.5 w-4.5 ${paymentMethod === 'BankTransfer' ? 'text-indigo-600' : 'text-transparent'}`} />
                    </label>

                    {/* VNPay */}
                    <label
                      className={`relative flex cursor-pointer rounded-lg border py-2.5 px-3.5 transition-all duration-200 ${paymentMethod === 'VNPay'
                          ? 'border-indigo-600 ring-2 ring-indigo-650/15'
                          : 'border-slate-200 hover:border-slate-300'
                        }`}
                      style={{
                        backgroundColor: paymentMethod === 'VNPay' ? '#f0f4ff' : '#ffffff',
                        color: paymentMethod === 'VNPay' ? '#4f46e5' : '#475569'
                      }}
                    >
                      <input type="radio" name="paymentMethod" value="VNPay" className="sr-only" checked={paymentMethod === 'VNPay'} onChange={() => setPaymentMethod('VNPay')} />
                      <span className="flex flex-1 items-center gap-2.5">
                        <QrCode size={16} className={paymentMethod === 'VNPay' ? 'text-indigo-600' : 'text-slate-400'} />
                        <span className="text-xs font-semibold">
                          Thanh toán VNPay (QR / ATM / Visa)
                        </span>
                      </span>
                      <CheckCircle className={`h-4.5 w-4.5 ${paymentMethod === 'VNPay' ? 'text-indigo-600' : 'text-transparent'}`} />
                    </label>
                  </div>
                </div>
              )}

              {/* QR Code Display for Bank Transfer */}
              {paymentMethod === 'BankTransfer' && totalAmountDue > 0 && (
                <div
                  className="p-5 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center animate-in fade-in"
                  style={{ backgroundColor: '#f8fafc' }}
                >
                  <p className="text-xs font-bold text-slate-550 uppercase tracking-wider mb-4" style={{ color: '#475569' }}>
                    Mã QR Chuyển khoản tự động
                  </p>
                  {isLoadingQr ? (
                    <div className="h-48 w-48 flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm">
                      <Loader2 className="animate-spin text-indigo-600" size={32} />
                    </div>
                  ) : qrDetails?.qrImageUrl ? (
                    <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <img src={qrDetails.qrImageUrl} alt="VietQR" className="h-48 w-48 object-contain rounded-lg" />
                    </div>
                  ) : (
                    <div className="h-48 w-48 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm text-slate-400 text-center px-4">
                      <QrCode size={32} className="mb-2 opacity-50 text-indigo-500" />
                      <span className="text-xs font-semibold">Không thể tải mã QR lúc này</span>
                    </div>
                  )}

                  {/* Manual Account Details */}
                  {qrDetails && (
                    <div className="w-full mt-4 bg-white p-3 rounded-lg border text-xs space-y-2">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Ngân hàng:</span>
                        <span className="fw-bold text-dark">{qrDetails.bankId}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Số tài khoản:</span>
                        <div className="d-flex align-items-center gap-1.5">
                          <span className="fw-bold text-dark">{qrDetails.accountNo}</span>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(qrDetails.accountNo);
                              alert("Đã sao chép số tài khoản!");
                            }}
                            className="btn btn-link p-0 text-decoration-none text-indigo-600 font-semibold"
                            style={{ fontSize: "11px" }}
                          >
                            Sao chép
                          </button>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Chủ tài khoản:</span>
                        <span className="fw-bold text-dark text-uppercase">{qrDetails.accountName}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">Nội dung chuyển khoản:</span>
                        <div className="d-flex align-items-center gap-1.5">
                          <span className="fw-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{qrDetails.transferDescription}</span>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(qrDetails.transferDescription);
                              alert("Đã sao chép nội dung chuyển khoản!");
                            }}
                            className="btn btn-link p-0 text-decoration-none text-indigo-600 font-semibold"
                            style={{ fontSize: "11px" }}
                          >
                            Sao chép
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed font-medium">
                    Vui lòng yêu cầu khách hàng quét mã này. <br /> Nhấn xác nhận khi nhận được tiền.
                  </p>
                </div>
              )}

              {/* VNPay integration sub-panels */}
              {paymentMethod === 'VNPay' && !pollStatus && totalAmountDue > 0 && (
                <div
                  className="p-5 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center animate-in fade-in"
                  style={{ backgroundColor: '#f8fafc' }}
                >
                  <QrCode size={32} className="mb-2 text-indigo-500 opacity-80" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Thanh toán qua cổng VNPay
                  </p>
                  <p className="text-xs text-slate-550 text-center leading-relaxed font-medium">
                    Hệ thống sẽ tạo mã QR và cổng thanh toán để khách hàng quét App ngân hàng, Thẻ ATM, hoặc Visa/Mastercard.
                    Nhấn nút thanh toán phía dưới để mở cổng VNPay.
                  </p>
                </div>
              )}

              {paymentMethod === 'VNPay' && pollStatus === 'checking' && (
                <div
                  className="p-5 rounded-2xl border border-blue-100 flex flex-col items-center justify-center animate-in fade-in"
                  style={{ backgroundColor: '#f0f9ff' }}
                >
                  <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wider text-center">
                    ĐANG CHỜ THANH TOÁN VNPAY...
                  </p>
                  <p className="text-xs text-blue-700 mt-2 text-center leading-relaxed font-medium">
                    Trang thanh toán VNPay đã được mở ở cửa sổ mới.
                    <br />
                    Nếu trình duyệt chặn cửa sổ bật lên, vui lòng click nút bên dưới:
                  </p>
                  {vnpayUrl && (
                    <button
                      onClick={() => window.open(vnpayUrl, '_blank')}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <QrCode size={14} /> Mở trang thanh toán VNPay
                    </button>
                  )}
                </div>
              )}

              {paymentMethod === 'VNPay' && pollStatus === 'failed' && (
                <div
                  className="p-5 rounded-2xl border border-red-100 flex flex-col items-center justify-center animate-in fade-in"
                  style={{ backgroundColor: '#fef2f2' }}
                >
                  <span className="text-3xl mb-2">❌</span>
                  <p className="text-xs font-bold text-red-900 uppercase tracking-wider text-center">
                    Giao dịch VNPay thất bại hoặc bị hủy
                  </p>
                  <p className="text-xs text-red-700 mt-2 text-center leading-relaxed font-medium">
                    Vui lòng bấm nút phía dưới để thử thanh toán lại.
                  </p>
                </div>
              )}

              {paymentMethod === 'VNPay' && pollStatus === 'expired' && (
                <div
                  className="p-5 rounded-2xl border border-amber-100 flex flex-col items-center justify-center animate-in fade-in"
                  style={{ backgroundColor: '#fffbeb' }}
                >
                  <span className="text-3xl mb-2">⏰</span>
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wider text-center">
                    Giao dịch VNPay đã hết hạn
                  </p>
                  <p className="text-xs text-amber-750 mt-2 text-center leading-relaxed font-medium">
                    Đã quá 15 phút. Vui lòng bấm nút thanh toán để tạo liên kết thanh toán mới.
                  </p>
                </div>
              )}

            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 bg-white">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                <BadgeCheck className="text-white w-10 h-10" strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-amber-400" />
                <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>Kích hoạt thành công!</h2>
                <Sparkles size={16} className="text-amber-400" />
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
                Hợp đồng đã được kích hoạt.<br />
                Thẻ hội viên đã sẵn sàng để sử dụng.
              </p>

              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-150"
              >
                Đóng
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'payment' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing && paymentMethod !== 'VNPay'} // Allow click again if VNPay polling
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-150 focus:ring-4 focus:ring-indigo-650/20 disabled:opacity-70 shadow-md shadow-indigo-650/10"
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff'
              }}
            >
              {isProcessing && paymentMethod !== 'VNPay' ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Đang xử lý...
                </>
              ) : paymentMethod === 'VNPay' ? (
                pollStatus === 'checking' ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Đang chờ thanh toán VNPay...
                  </>
                ) : (
                  <>
                    <QrCode size={18} />
                    Mở cổng thanh toán VNPay
                  </>
                )
              ) : totalAmountDue === 0 ? (
                <>
                  <Zap size={18} className="text-yellow-300" />
                  Kích hoạt ngay &mdash; Miễn phí
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Xác nhận đã nhận {formatCurrency(totalAmountDue)}
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default UnifiedPaymentDrawer;
