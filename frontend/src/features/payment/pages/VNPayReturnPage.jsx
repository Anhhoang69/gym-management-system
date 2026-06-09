import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { validateVNPayReturn } from '../services/vnpayService';

/**
 * VNPayReturnPage — Public page, không cần auth.
 * VNPay redirect browser về đây sau khi user thanh toán.
 * Backend re-validate signature → hiển thị kết quả.
 */
export default function VNPayReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState('loading'); // loading | success | cancelled | failed | error
  const [result, setResult] = useState(null);
  const called = useRef(false);

  const responseCode = searchParams.get('vnp_ResponseCode');
  const amount = searchParams.get('vnp_Amount');
  const bankCode = searchParams.get('vnp_BankCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');

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
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Đang xác nhận kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.card, borderTop: '4px solid #2e7d32' }}>
          <div style={styles.icon}>✅</div>
          <h1 style={{ ...styles.title, color: '#2e7d32' }}>Thanh toán thành công!</h1>
          <p style={styles.subtitle}>
            Hợp đồng và thẻ tập của bạn đang được kích hoạt.
          </p>

          {(amount || bankCode) && (
            <div style={styles.infoBox}>
              {amount && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>💰 Số tiền</span>
                  <span style={styles.infoValue}>{formatAmount(amount)}</span>
                </div>
              )}
              {bankCode && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>🏦 Ngân hàng</span>
                  <span style={styles.infoValue}>{bankCode}</span>
                </div>
              )}
              {transactionNo && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>🔖 Mã GD</span>
                  <span style={{ ...styles.infoValue, fontFamily: 'monospace', fontSize: 13 }}>{transactionNo}</span>
                </div>
              )}
            </div>
          )}

          <p style={styles.note}>
            📧 Thông tin thẻ tập sẽ được gửi đến email của bạn trong ít phút.
          </p>

          <div style={styles.buttonGroup}>
            <button style={styles.primaryBtn} onClick={() => navigate('/login')}>
              Đăng nhập để xem thẻ tập
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate('/')}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'cancelled') {
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.card, borderTop: '4px solid #e65100' }}>
          <div style={styles.icon}>⚠️</div>
          <h1 style={{ ...styles.title, color: '#e65100' }}>Bạn đã hủy giao dịch</h1>
          <p style={styles.subtitle}>
            Hóa đơn của bạn vẫn còn hiệu lực. Bạn có thể thanh toán lại bất cứ lúc nào.
          </p>
          <div style={styles.buttonGroup}>
            <button style={styles.primaryBtn} onClick={() => navigate('/login')}>
              Đăng nhập để thử lại
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate('/')}>
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // failed / error
  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.card, borderTop: '4px solid #c62828' }}>
        <div style={styles.icon}>❌</div>
        <h1 style={{ ...styles.title, color: '#c62828' }}>Thanh toán thất bại</h1>
        <p style={styles.subtitle}>
          {result?.message || 'Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ nhân viên.'}
        </p>
        {responseCode && responseCode !== '00' && (
          <p style={styles.errorCode}>Mã lỗi: <code>{responseCode}</code></p>
        )}
        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn} onClick={() => navigate('/login')}>
            Đăng nhập để thử lại
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/')}>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '24px',
    fontFamily: "'Inter', 'Arial', sans-serif",
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  icon: { fontSize: '64px', marginBottom: '16px' },
  title: { fontSize: '26px', fontWeight: '700', margin: '0 0 12px', color: '#1a1a2e' },
  subtitle: { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 24px' },
  note: {
    fontSize: '13px',
    color: '#666',
    background: '#f5f5f5',
    borderRadius: '8px',
    padding: '12px',
    margin: '0 0 24px',
    lineHeight: '1.5',
  },
  infoBox: {
    background: '#f8fafb',
    borderRadius: '10px',
    padding: '16px',
    margin: '0 0 20px',
    textAlign: 'left',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid #eee',
  },
  infoLabel: { color: '#888', fontSize: '13px' },
  infoValue: { color: '#1a1a2e', fontWeight: '600', fontSize: '14px' },
  errorCode: { color: '#888', fontSize: '13px', margin: '0 0 24px' },
  buttonGroup: { display: 'flex', gap: '12px', flexDirection: 'column' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: '#e2b96f',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#555',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f0f0f0',
    borderTop: '4px solid #1a1a2e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: { color: '#888', fontSize: '15px' },
};
