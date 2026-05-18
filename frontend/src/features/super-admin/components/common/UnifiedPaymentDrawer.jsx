import React, { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Banknote, QrCode, Loader2 } from 'lucide-react';
import { getInvoiceQr, collectPayment } from '../../services/invoiceService';
import { activateContract } from '../../services/contractService';

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
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('payment'); // 'payment', 'success'
  const [error, setError] = useState(null);

  // Reset state when drawer opens with a new invoice
  useEffect(() => {
    if (isOpen && invoiceId) {
      setStep('payment');
      setError(null);
      setPaymentMethod('Cash');
      fetchQrCode(invoiceId);
    }
  }, [isOpen, invoiceId]);

  const fetchQrCode = async (id) => {
    try {
      setIsLoadingQr(true);
      const data = await getInvoiceQr(id);
      if (data && data.qrUrl) {
        setQrCodeUrl(data.qrUrl);
      }
    } catch (err) {
      console.error("Failed to load QR code:", err);
      // It's okay if QR fails, they can still pay cash/card
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!invoiceId || !contractId) {
      setError("Missing invoice or contract information.");
      return;
    }

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
        onClick={!isProcessing ? onClose : undefined}
      ></div>

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[101] w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Thanh toán & Kích hoạt
          </h2>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {step === 'payment' && (
            <div className="p-6 space-y-8">
              
              {/* Invoice Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/30">
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">Tổng tiền thanh toán</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                  {formatCurrency(totalAmountDue)}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Mã hóa đơn:</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{invoiceCode || 'N/A'}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              {/* Payment Methods */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Phương thức thanh toán</h3>
                <div className="grid gap-3">
                  {/* Cash */}
                  <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${paymentMethod === 'Cash' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                    <input type="radio" name="paymentMethod" value="Cash" className="sr-only" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Banknote size={18} className={paymentMethod === 'Cash' ? 'text-indigo-600' : 'text-gray-400'} />
                          Tiền mặt
                        </span>
                      </span>
                    </span>
                    <CheckCircle className={`h-5 w-5 ${paymentMethod === 'Cash' ? 'text-indigo-600' : 'text-transparent'}`} />
                  </label>

                  {/* Card */}
                  <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${paymentMethod === 'Card' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                    <input type="radio" name="paymentMethod" value="Card" className="sr-only" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <CreditCard size={18} className={paymentMethod === 'Card' ? 'text-indigo-600' : 'text-gray-400'} />
                          Quẹt thẻ (POS)
                        </span>
                      </span>
                    </span>
                    <CheckCircle className={`h-5 w-5 ${paymentMethod === 'Card' ? 'text-indigo-600' : 'text-transparent'}`} />
                  </label>

                  {/* Transfer / VietQR */}
                  <label className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none ${paymentMethod === 'BankTransfer' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                    <input type="radio" name="paymentMethod" value="BankTransfer" className="sr-only" checked={paymentMethod === 'BankTransfer'} onChange={() => setPaymentMethod('BankTransfer')} />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <QrCode size={18} className={paymentMethod === 'BankTransfer' ? 'text-indigo-600' : 'text-gray-400'} />
                          Chuyển khoản / VietQR
                        </span>
                      </span>
                    </span>
                    <CheckCircle className={`h-5 w-5 ${paymentMethod === 'BankTransfer' ? 'text-indigo-600' : 'text-transparent'}`} />
                  </label>
                </div>
              </div>

              {/* QR Code Display for Bank Transfer */}
              {paymentMethod === 'BankTransfer' && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Mã QR Chuyển khoản tự động</p>
                  {isLoadingQr ? (
                    <div className="h-48 w-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <Loader2 className="animate-spin text-indigo-600" size={32} />
                    </div>
                  ) : qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="VietQR" className="h-48 w-48 object-contain rounded-xl" />
                  ) : (
                    <div className="h-48 w-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-400 text-center px-4">
                      <QrCode size={32} className="mb-2 opacity-50" />
                      <span className="text-xs">Không thể tải mã QR lúc này</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    Vui lòng yêu cầu khách hàng quét mã này. <br/> Nhấn xác nhận khi nhận được tiền.
                  </p>
                </div>
              )}

            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-emerald-500 w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thanh toán thành công!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Hợp đồng đã được kích hoạt.<br/>
                Thẻ hội viên đã sẵn sàng để sử dụng.
              </p>
              
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 font-medium rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'payment' && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-xl font-medium transition-all focus:ring-4 focus:ring-indigo-600/20 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Đang xử lý...
                </>
              ) : (
                <>Xác nhận đã nhận {formatCurrency(totalAmountDue)}</>
              )}
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default UnifiedPaymentDrawer;
