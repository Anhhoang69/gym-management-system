import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
  CBadge
} from "@coreui/react"
import { useEffect, useState } from "react"
import { getInvoiceById } from "../../services/invoiceService"
import moment from "moment"
import { FileText, Printer, ShieldCheck } from "lucide-react"

function InvoiceDetailModal({ visible, onClose, invoiceId }) {
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && invoiceId) {
      loadInvoice()
    }
  }, [visible, invoiceId])

  const loadInvoice = async () => {
    setLoading(true)
    try {
      const data = await getInvoiceById(invoiceId)
      setInvoice(data)
    } catch (err) {
      console.error("Failed to load invoice detail", err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <CBadge color="warning">Chưa thanh toán</CBadge>
      case 'Paid':
        return <CBadge color="success">Đã thanh toán</CBadge>
      case 'Overdue':
        return <CBadge color="danger">Quá hạn</CBadge>
      case 'Cancelled':
        return <CBadge color="secondary">Đã hủy</CBadge>
      default:
        return <CBadge color="secondary">{status}</CBadge>
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" alignment="center" scrollable>
      <CModalHeader closeButton className="border-0 pb-0 bg-light">
        <CModalTitle className="fw-bold fs-5 d-flex align-items-center gap-2 text-dark">
          <FileText className="text-warning" size={20} />
          Chi Tiết Hóa Đơn #{invoiceId?.slice(-10).toUpperCase()}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="bg-light p-4">
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="warning" />
            <div className="mt-2 text-muted">Đang tải hóa đơn...</div>
          </div>
        ) : invoice ? (
          /* Paper Invoice Sheet */
          <div className="bg-white p-5 rounded-3 shadow-sm border mx-auto text-dark position-relative" style={{
            maxWidth: "720px",
            fontFamily: "'Times New Roman', Times, serif",
            lineHeight: 1.6,
            fontSize: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}>
            {/* National Motto / Header */}
            <div className="text-center mb-4">
              <h5 className="fw-bold mb-1" style={{ letterSpacing: "0.5px" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
              <div className="fw-semibold small mb-2">Độc lập - Tự do - Hạnh phúc</div>
              <div style={{ width: "160px", borderBottom: "1.5px solid #000", margin: "0 auto 20px" }}></div>
            </div>

            {/* Invoice Header */}
            <div className="text-center mb-5">
              <h4 className="fw-bold mb-1 text-uppercase" style={{ letterSpacing: "1px", color: "#111" }}>Hóa Đơn Giá Trị Gia Tăng</h4>
              <div className="text-muted small">Mã tra cứu: {invoice.invoiceCode?.slice(-10).toUpperCase()}</div>
              <div className="text-muted small">Ngày phát hành: {moment(invoice.createdAt).format("DD/MM/YYYY HH:mm")}</div>
              <div className="mt-2">{getStatusBadge(invoice.status)}</div>
            </div>

            {/* BÊN BÁN */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>ĐƠN VỊ BÁN HÀNG (BÊN BÁN)</h6>
              <div className="row g-1 ps-2">
                <div className="col-12"><span className="fw-semibold">Đơn vị bán hàng:</span> CÔNG TY CỔ PHẦN ENERGYM VIỆT NAM</div>
                <div className="col-12"><span className="fw-semibold">Mã số thuế:</span> 0109876543</div>
                <div className="col-12"><span className="fw-semibold">Địa chỉ:</span> Tòa nhà EnerGym, Hà Nội, Việt Nam</div>
                <div className="col-12"><span className="fw-semibold">Số tài khoản:</span> 1902 3456 7899 (Techcombank)</div>
              </div>
            </div>

            {/* BÊN MUA */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>THÔNG TIN KHÁCH HÀNG (BÊN MUA)</h6>
              <div className="row g-1 ps-2">
                <div className="col-12"><span className="fw-semibold">Họ tên người mua:</span> {invoice.memberName || "Khách hàng hội viên"}</div>
                {invoice.contractId && (
                  <div className="col-12"><span className="fw-semibold">Liên kết hợp đồng số:</span> {invoice.contractId.slice(-10).toUpperCase()}</div>
                )}
              </div>
            </div>

            {/* DETAILS TABLE */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>CHI TIẾT DỊCH VỤ & THANH TOÁN</h6>
              <table className="table table-bordered mt-2 text-center" style={{ fontSize: "14px" }}>
                <thead>
                  <tr className="table-light">
                    <th style={{ width: "80px" }}>STT</th>
                    <th>Tên dịch vụ / Gói hội viên</th>
                    <th>Đơn giá gốc</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td className="text-start">Đăng ký & Kích hoạt gói tập hội viên EnerGym</td>
                    <td>{formatCurrency(invoice.subtotal + invoice.discountAmount)}</td>
                    <td>1</td>
                    <td>{formatCurrency(invoice.subtotal + invoice.discountAmount)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Summary Section */}
              <div className="d-flex flex-column align-items-end mt-3 ps-5">
                <div className="w-100" style={{ maxWidth: "350px" }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted small">Cộng tiền dịch vụ:</span>
                    <span className="text-dark fw-semibold">{formatCurrency(invoice.subtotal + invoice.discountAmount)}</span>
                  </div>
                  {invoice.discountAmount > 0 && (
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted small">Chiết khấu giảm giá:</span>
                      <span className="text-danger fw-semibold">-{formatCurrency(invoice.discountAmount)}</span>
                    </div>
                  )}
                  {invoice.taxAmount > 0 && (
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted small">Thuế GTGT (VAT):</span>
                      <span className="text-dark fw-semibold">+{formatCurrency(invoice.taxAmount)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between border-top pt-2">
                    <span className="text-dark fw-bold">Tổng tiền thanh toán:</span>
                    <span className="text-success fw-bold fs-5">{formatCurrency(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature & Stamp Section */}
            <div className="row mt-5 pt-3 g-4 text-center">
              {/* Buyer */}
              <div className="col-6">
                <div className="fw-bold">NGƯỜI MUA HÀNG</div>
                <div className="text-muted small mb-4">(Ký, ghi rõ họ tên)</div>
                <div className="text-muted mt-5 pt-3 small" style={{ fontStyle: "italic" }}>
                  Đã xác nhận điện tử
                </div>
              </div>

              {/* Vendor Seal */}
              <div className="col-6 position-relative">
                <div className="fw-bold">NGƯỜI BÁN HÀNG</div>
                <div className="text-muted small mb-4">(Ký số & đóng dấu điện tử)</div>

                {invoice.status === 'Paid' && (
                  <div className="position-absolute start-50 top-50 translate-middle" style={{
                    border: "3px double #d9534f",
                    color: "#d9534f",
                    borderRadius: "50%",
                    width: "120px",
                    height: "120px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "11px",
                    transform: "rotate(-15deg) translate(-20px, 10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    boxShadow: "0 0 5px rgba(217, 83, 79, 0.2)",
                    zIndex: 2,
                    pointerEvents: "none",
                    fontFamily: "monospace"
                  }}>
                    <span style={{ fontSize: "9px" }}>ENERGYM VIETNAM</span>
                    <span className="border-top border-bottom py-0.5 my-0.5 fw-bold" style={{ borderColor: "#d9534f" }}>ĐÃ KÝ SỐ</span>
                    <span>{moment(invoice.createdAt).format("DD/MM/YYYY")}</span>
                  </div>
                )}

                <div className="text-success d-flex flex-column align-items-center justify-content-center mt-5 pt-3" style={{ minHeight: "40px" }}>
                  {invoice.status === 'Paid' && (
                    <>
                      <ShieldCheck size={24} className="text-success mb-1" />
                      <span className="fw-bold small" style={{ fontSize: "10px" }}>HÓA ĐƠN ĐÃ THANH TOÁN</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">Không tìm thấy thông tin hóa đơn.</div>
        )}
      </CModalBody>

      <CModalFooter className="border-0 bg-light">
        <CButton color="primary" className="px-4 fw-bold shadow-sm text-white" onClick={handlePrint}>
          <Printer size={16} className="me-1" /> In Hóa Đơn
        </CButton>
        <CButton color="secondary" variant="outline" onClick={onClose} className="px-4 fw-bold bg-white">
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default InvoiceDetailModal
