import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../services/vnpayService';

/**
 * VNPayConfirmPage — Public page, không cần auth.
 * Hiển thị ngay sau khi register thành công.
 * Nhận props từ URL search params: paymentUrl, invoiceCode, amount, txnRef, expiredAt.
 * Sau khi user bấm "Thanh toán ngay" → redirect sang VNPay.
 * Nếu invoiceId được cung cấp → poll status để biết khi nào IPN về.
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
  const pollRef = useRef(null);
  const openedRef = useRef(false);

  const expiredAt = expiredAtStr ? new Date(expiredAtStr) : null;

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

  // Poll status sau khi đã mở tab VNPay
  useEffect(() => {
    if (!invoiceId || !openedRef.current) return;
    let attempts = 0;
    const maxAttempts = 40; // 40 * 3s = 2 phút
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
    // Force trigger poll if invoiceId exists
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
      <div style={styles.wrapper}>
        <div style={{ ...styles.card, borderTop: '4px solid #2e7d32' }}>
          <div style={styles.bigIcon}>🎉</div>
          <h1 style={{ ...styles.title, color: '#2e7d32' }}>Thanh toán thành công!</h1>
          <p style={styles.subtitle}>
            Thẻ tập của bạn đã được kích hoạt. Thông tin sẽ được gửi đến email.
          </p>
          <button style={styles.primaryBtn} onClick={() => navigate('/login')}>
            Đăng nhập để xem thẻ tập →
          </button>
        </div>
      </div>
    );
  }

  if (!paymentUrl) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.bigIcon}>⚠️</div>
          <h1 style={styles.title}>Không tìm thấy link thanh toán</h1>
          <p style={styles.subtitle}>Vui lòng kiểm tra email hoặc liên hệ nhân viên.</p>
          <button style={styles.primaryBtn} onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>💪 GYM Management System</div>
      </div>

      <div style={styles.card}>
        {/* Greeting */}
        <div style={styles.successBadge}>✅ Đăng ký thành công!</div>
        <h1 style={styles.title}>
          {memberName ? `Xin chào ${memberName}!` : 'Chào mừng bạn!'}
        </h1>
        <p style={styles.subtitle}>
          Bạn chỉ cần thanh toán hóa đơn bên dưới để kích hoạt thẻ tập ngay hôm nay.
        </p>

        {/* Invoice info */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>📋 Mã hóa đơn</span>
            <span style={{ ...styles.infoValue, fontFamily: 'monospace' }}>{invoiceCode || '—'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>💰 Số tiền</span>
            <span style={{ ...styles.infoValue, color: '#c62828', fontSize: 18, fontWeight: 700 }}>
              {formatAmount(amount)}
            </span>
          </div>
          {expiredAt && !isExpired && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>⏱ Link hết hạn sau</span>
              <span style={{ ...styles.infoValue, color: countdown < '05:00' ? '#c62828' : '#e65100', fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>
                {countdown}
              </span>
            </div>
          )}
        </div>

        {/* Expired warning */}
        {isExpired && (
          <div style={styles.expiredBanner}>
            ⏰ Link thanh toán đã hết hạn. Vui lòng đăng nhập để tạo link mới.
          </div>
        )}

        {/* Poll status */}
        {pollStatus === 'checking' && (
          <div style={styles.pollingBanner}>
            <div style={styles.smallSpinner} />
            Đang chờ xác nhận thanh toán từ VNPay...
          </div>
        )}

        {pollStatus === 'failed' && (
          <div style={styles.failedBanner}>
            ❌ Giao dịch thất bại hoặc bị hủy. Bạn có thể thử thanh toán lại.
          </div>
        )}

        {/* CTA Buttons */}
        {!isExpired ? (
          <button
            style={pollStatus === 'checking' ? { ...styles.payBtn, opacity: 0.7 } : styles.payBtn}
            onClick={handlePayNow}
          >
            {pollStatus === 'checking'
              ? '⏳ Đang chờ VNPay phản hồi...'
              : '💳 Thanh toán ngay qua VNPay'}
          </button>
        ) : (
          <button style={styles.payBtn} onClick={() => navigate('/login')}>
            🔑 Đăng nhập để tạo link mới
          </button>
        )}

        <button style={styles.skipBtn} onClick={() => navigate('/login')}>
          Tôi sẽ thanh toán sau
        </button>

        {/* Note */}
        <div style={styles.noteBox}>
          <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.6 }}>
            🔒 Thanh toán được bảo mật bởi VNPay — cổng thanh toán hàng đầu Việt Nam.
            {' '}Thẻ test: <code>9704198526191432198</code> / OTP: <code>123456</code>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'Inter', 'Arial', sans-serif",
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  logo: {
    color: '#e2b96f',
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px 36px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
    textAlign: 'center',
  },
  successBadge: {
    display: 'inline-block',
    background: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  bigIcon: { fontSize: '64px', marginBottom: '12px' },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 10px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 24px',
  },
  infoBox: {
    background: '#f8fafb',
    borderRadius: '12px',
    padding: '16px',
    margin: '0 0 20px',
    textAlign: 'left',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  infoLabel: { color: '#888', fontSize: '13px' },
  infoValue: { color: '#1a1a2e', fontWeight: '600', fontSize: '14px' },
  expiredBanner: {
    background: '#fff3e0',
    color: '#e65100',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    margin: '0 0 16px',
    border: '1px solid #ffcc02',
  },
  pollingBanner: {
    background: '#e3f2fd',
    color: '#1565c0',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    margin: '0 0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'center',
  },
  failedBanner: {
    background: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    margin: '0 0 16px',
  },
  payBtn: {
    background: 'linear-gradient(135deg, #e65100, #ff8f00)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '12px',
    transition: 'transform 0.15s',
    boxShadow: '0 4px 20px rgba(230,81,0,0.3)',
  },
  skipBtn: {
    background: 'transparent',
    color: '#888',
    border: 'none',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px',
    marginBottom: '20px',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: '#e2b96f',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
  },
  noteBox: {
    background: '#f5f5f5',
    borderRadius: '8px',
    padding: '12px',
  },
  smallSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ccc',
    borderTop: '2px solid #1565c0',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
};
