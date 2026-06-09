import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle, CreditCard, Landmark, FileText, Loader2, ShieldCheck } from 'lucide-react';
import { validateVNPayReturn } from '../services/vnpayService';
import logoBlack from '../../../assets/LogoBlackText.svg';
import logoWhite from '../../../assets/LogoWhiteText.svg';

/**
 * VNPayReturnPage — Public page, không cần auth.
 * VNPay redirect browser về đây sau khi user thanh toán.
 * Sử dụng Tailwind CSS, hỗ trợ Light/Dark Mode theo hệ thống.
 */
export default function VNPayReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState('loading'); // loading | success | cancelled | failed
  const [result, setResult] = useState(null);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const called = useRef(false);

  const responseCode = searchParams.get('vnp_ResponseCode');
  const amount = searchParams.get('vnp_Amount');
  const bankCode = searchParams.get('vnp_BankCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');

  // Sync Dark/Light mode class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const queryString = window.location.search;
    validateVNPayReturn(queryString)
      .then((data) => {
        setResult(data);
        if (data.success) setState('success');
        else if (data.responseCode === '24') setState('cancelled');
        else setState('failed');
      })
      .catch(() => {
        // Fallback: dùng query params trực tiếp nếu backend unreachable
        if (responseCode === '00') setState('success');
        else if (responseCode === '24') setState('cancelled');
        else setState('failed');
      });
  }, []);

  const formatAmount = (vnpAmount) => {
    if (!vnpAmount) return '—';
    return new Intl.NumberFormat('vi-VN').format(parseInt(vnpAmount) / 100) + ' VND';
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
        <div className="w-full max-w-[460px] p-8 md:p-10 rounded-2xl shadow-xl bg-[var(--bg-third)] border border-[var(--border)] text-center flex flex-col items-center justify-center animate-[fade-in-up_0.3s_ease-out]">
          <Loader2 className="animate-spin text-[var(--brand)] mb-4" size={40} />
          <p className="text-sm font-medium text-[var(--text-secondary)]">Đang xác nhận kết quả thanh toán từ VNPay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header */}
      <div className="mb-6 text-center">
        <img
          src={isDark ? logoWhite : logoBlack}
          alt="EnerGym Logo"
          className="h-12 object-contain"
        />
      </div>

      <div className="w-full max-w-[460px] p-8 md:p-10 rounded-2xl shadow-xl bg-[var(--bg-third)] border border-[var(--border)] text-center animate-[fade-in-up_0.3s_ease-out]">
        
        {state === 'success' && (
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-500">Thanh toán thành công!</h1>
            <p className="text-sm mt-3 text-[var(--text-secondary)] leading-relaxed">
              Cảm ơn bạn! Hợp đồng và thẻ tập của bạn đã được kích hoạt thành công trên hệ thống.
            </p>

            {(amount || bankCode || transactionNo) && (
              <div className="w-full mt-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-left">
                {amount && (
                  <div className="flex justify-between items-center py-2.5 border-b border-[var(--border)]">
                    <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[var(--text-secondary)]" />
                      Số tiền đã trả
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{formatAmount(amount)}</span>
                  </div>
                )}
                {bankCode && (
                  <div className="flex justify-between items-center py-2.5 border-b border-[var(--border)]">
                    <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Landmark size={14} className="text-[var(--text-secondary)]" />
                      Ngân hàng thanh toán
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{bankCode}</span>
                  </div>
                )}
                {transactionNo && (
                  <div className="flex justify-between items-center py-2.5 border-b border-[var(--border)] last:border-0">
                    <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                      <FileText size={14} className="text-[var(--text-secondary)]" />
                      Mã giao dịch VNPay
                    </span>
                    <span className="text-sm font-semibold font-mono text-[var(--text-primary)]">{transactionNo}</span>
                  </div>
                )}
              </div>
            )}

            <div className="w-full mt-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
              <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed flex items-center justify-center gap-1.5">
                📧 Thông tin chi tiết thẻ tập và hợp đồng đã được gửi về email của bạn.
              </p>
            </div>
          </div>
        )}

        {state === 'cancelled' && (
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-6">
              <AlertTriangle size={40} className="text-amber-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--brand)]">Bạn đã hủy thanh toán</h1>
            <p className="text-sm mt-3 text-[var(--text-secondary)] leading-relaxed">
              Giao dịch đã được hủy theo yêu cầu. Hóa đơn đăng ký vẫn còn hiệu lực, bạn có thể thực hiện thanh toán lại bất cứ lúc nào.
            </p>
          </div>
        )}

        {state === 'failed' && (
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-red-500">Thanh toán thất bại</h1>
            <p className="text-sm mt-3 text-[var(--text-secondary)] leading-relaxed">
              {result?.message || 'Giao dịch không thành công tại cổng VNPay. Vui lòng kiểm tra tài khoản và thử lại.'}
            </p>
            {responseCode && responseCode !== '00' && (
              <p className="mt-4 text-xs text-red-400">Mã phản hồi từ VNPay: <code>{responseCode}</code></p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-black bg-[var(--brand)] hover:brightness-95 active:scale-[0.98] transition-all duration-200 shadow-md shadow-[var(--brand)]/15"
          >
            {state === 'success' ? 'Đăng nhập xem thẻ tập' : 'Đăng nhập thử lại'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 rounded-xl font-semibold text-[var(--text-secondary)] bg-transparent border border-[var(--border)] hover:text-[var(--text-primary)] hover:bg-[var(--hover)] transition-all duration-200 text-sm"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
