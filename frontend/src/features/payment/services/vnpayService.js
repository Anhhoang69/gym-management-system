import api from '../../../shared/api/api';

const BASE = '/api/payments/vnpay';

/**
 * Tạo VNPay payment URL cho một Invoice đang Pending.
 * @returns { paymentUrl, txnRef, expiredAt, amount, invoiceCode }
 */
export const createVNPayUrl = async (invoiceId) => {
  const res = await api.post(`${BASE}/create`, { invoiceId });
  return res.data.data;
};

/**
 * Poll trạng thái payment của invoice.
 * @returns { status, invoiceStatus, gatewayResponseCode, paidAt, expiredAt, amount }
 */
export const getPaymentStatus = async (invoiceId) => {
  const res = await api.get(`${BASE}/status/${invoiceId}`);
  return res.data.data;
};

/**
 * Validate ReturnUrl params từ VNPay (backend re-validate signature).
 * @param {string} queryString - raw window.location.search string
 * @returns { success, responseCode, message, amount, bankCode, transactionNo }
 */
export const validateVNPayReturn = async (queryString) => {
  const res = await api.get(`${BASE}/return${queryString}`);
  return res.data.data;
};
