import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, FileText, CreditCard, AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';
import { getPaymentStatus } from '../services/vnpayService';
import logoBlack from '../../../assets/LogoBlackText.svg';
import logoWhite from '../../../assets/LogoWhiteText.svg';

/**
 * VNPayConfirmPage — Public page, không cần auth.
 * Hiển thị ngay sau khi register thành công.
 * Sử dụng Tailwind CSS, hỗ trợ Light/Dark Mode theo hệ thống.
 */
export default function VNPayConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentUrl = searchParams.get('paymentUrl');
  const invoiceCode = searchParams.get('invoiceCode');
  const amount = searchParams.get('amount');
  const expiredAtStr = searchParams.get('expiredAt');
  const invoiceId = searchParams.get('invoiceId');
  const memberName = searchParams.get('name');

  const [countdown, setCountdown] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [pollStatus, setPollStatus] = useState(null); // null | 'checking' | 'paid' | 'failed'
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const pollRef = useRef(null);
  const openedRef = useRef(false);

  const expiredAt = expiredAtStr ? new Date(expiredAtStr) : null;

  // Sync Dark/Light mode class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!expiredAt) return;
    const tick = () => {
      const diff = expiredAt.getTime() - Date.now();
      if (diff <= 0) {
        setIsExpired(true);
        setCountdown('00:00');
        clearInterval(timer);
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiredAtStr]);

  // Poll status after VNPay tab is opened
  useEffect(() => {
    if (!invoiceId || !openedRef.current) return;
    let attempts = 0;
    const maxAttempts = 40; // 40 * 3s = 2 mins
    setPollStatus('checking');

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const status = await getPaymentStatus(invoiceId);
        if (status?.status === 'Completed') {
          clearInterval(pollRef.current);
          setPollStatus('paid');
        } else if (status?.status === 'Failed' || status?.status === 'Cancelled') {
          clearInterval(pollRef.current);
          setPollStatus('failed');
        }
      } catch {
        // ignore poll errors
      }
      if (attempts >= maxAttempts) {
        clearInterval(pollRef.current);
        setPollStatus(null);
      }
    }, 3000);

    return () => clearInterval(pollRef.current);
  }, [invoiceId]);

  const handlePayNow = () => {
    if (!paymentUrl) return;
    openedRef.current = true;
    window.open(paymentUrl, '_blank');
    if (invoiceId) {
      setPollStatus('checking');
      let attempts = 0;
      clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        attempts++;
        try {
          const status = await getPaymentStatus(invoiceId);
          if (status?.status === 'Completed') {
            clearInterval(pollRef.current);
            setPollStatus('paid');
          } else if (status?.status === 'Failed' || status?.status === 'Cancelled') {
            clearInterval(pollRef.current);
            setPollStatus('failed');
          }
        } catch { }
        if (attempts >= 40) clearInterval(pollRef.current);
      }, 3000);
    }
  };

  const formatAmount = (a) => {
    if (!a) return '—';
    return new Intl.NumberFormat('vi-VN').format(parseFloat(a)) + ' VND';
  };

  if (pollStatus === 'paid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
        <div className="w-full max-w-[460px] p-8 md:p-10 rounded-2xl shadow-xl bg-[var(--bg-third)] border border-[var(--border)] text-center animate-[fade-in-up_0.3s_ease-out] flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-emerald-500">Thanh toán thành công!</h1>
          <p className="text-sm mt-3 text-[var(--text-secondary)] leading-relaxed">
            Thẻ tập của bạn đã được kích hoạt. Thông tin chi tiết đã được gửi đến email đăng ký.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-8 py-3.5 px-6 rounded-xl font-semibold text-black bg-[var(--brand)] hover:brightness-95 active:scale-[0.98] transition-all duration-250 shadow-md shadow-[var(--brand)]/10"
          >
            Đăng nhập để xem thẻ tập →
          </button>
        </div>
      </div>
    );
  }

  if (!paymentUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
        <div className="w-full max-w-[460px] p-8 md:p-10 rounded-2xl shadow-xl bg-[var(--bg-third)] border border-[var(--border)] text-center animate-[fade-in-up_0.3s_ease-out] flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-6">
            <AlertTriangle size={40} className="text-amber-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Không tìm thấy link</h1>
          <p className="text-sm mt-3 text-[var(--text-secondary)] leading-relaxed">
            Vui lòng kiểm tra email hoặc liên hệ với nhân viên EnerGym để được trợ giúp.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-8 py-3.5 px-6 rounded-xl font-semibold text-black bg-[var(--brand)] hover:brightness-95 active:scale-[0.98] transition-all duration-250 shadow-md"
          >
            Về trang chủ
          </button>
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
        {/* Greeting */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
          <CheckCircle2 size={13} />
          Đăng ký tài khoản thành công!
        </div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-5 text-[var(--text-primary)]">
          {memberName ? `Xin chào ${memberName}!` : 'Chào mừng bạn đến với EnerGym!'}
        </h1>
        
        <p className="text-sm mt-3 text-[var(--text-secondary)] leading-relaxed">
          Bạn chỉ cần hoàn tất thanh toán hóa đơn bên dưới qua VNPay để kích hoạt thẻ tập ngay lập tức.
        </p>

        {/* Invoice info */}
        <div className="mt-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-left">
          <div className="flex justify-between items-center py-2.5 border-b border-[var(--border)]">
            <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
              <FileText size={14} className="text-[var(--text-secondary)]" />
              Mã hóa đơn
            </span>
            <span className="text-sm font-semibold font-mono text-[var(--text-primary)]">{invoiceCode || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 border-b border-[var(--border)]">
            <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
              <CreditCard size={14} className="text-[var(--text-secondary)]" />
              Số tiền cần trả
            </span>
            <span className="text-sm font-extrabold text-[var(--brand)]">
              {formatAmount(amount)}
            </span>
          </div>
          {expiredAt && !isExpired && (
            <div className="flex justify-between items-center py-2.5 border-b border-[var(--border)] last:border-0">
              <span className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--text-secondary)]" />
                Link hết hạn sau
              </span>
              <span className={`text-sm font-bold font-mono ${countdown < '05:00' ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                {countdown}
              </span>
            </div>
          )}
        </div>

        {/* Expired warning */}
        {isExpired && (
          <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-xl text-xs bg-red-500/10 text-red-500 border border-red-500/20 text-left">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>Liên kết thanh toán đã hết hạn. Vui lòng đăng nhập để tạo liên kết mới.</span>
          </div>
        )}

        {/* Poll status */}
        {pollStatus === 'checking' && (
          <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-xl text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 text-left">
            <Loader2 className="animate-spin flex-shrink-0" size={16} />
            <span>Đang chờ xác nhận giao dịch từ cổng VNPay...</span>
          </div>
        )}

        {pollStatus === 'failed' && (
          <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-xl text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 text-left">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>Giao dịch không thành công hoặc bị hủy. Bạn có thể bấm thử lại.</span>
          </div>
        )}

        {/* CTA Buttons */}
        {!isExpired ? (
          <button
            onClick={handlePayNow}
            disabled={pollStatus === 'checking'}
            className="w-full mt-6 py-3.5 px-6 rounded-xl font-bold text-black bg-[var(--brand)] hover:brightness-95 active:scale-[0.98] transition-all duration-200 shadow-md shadow-[var(--brand)]/15 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {pollStatus === 'checking' ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang kiểm tra kết quả...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Thanh toán ngay qua VNPay
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-6 py-3.5 px-6 rounded-xl font-bold text-black bg-[var(--brand)] hover:brightness-95 active:scale-[0.98] transition-all duration-200"
          >
            Đăng nhập để tạo link mới
          </button>
        )}

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-3 py-3 px-6 rounded-xl font-semibold text-[var(--text-secondary)] bg-transparent hover:text-[var(--text-primary)] transition-all duration-200 text-xs underline cursor-pointer"
        >
          Tôi sẽ thanh toán sau
        </button>

        {/* Note */}
        <div className="mt-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Bảo mật thanh toán bởi VNPay.</span>
          </p>
          <p className="text-[11px] text-gray-500 mt-1 font-mono">
            Thẻ test: 9704198526191432198 | OTP: 123456
          </p>
        </div>
      </div>
    </div>
  );
}
