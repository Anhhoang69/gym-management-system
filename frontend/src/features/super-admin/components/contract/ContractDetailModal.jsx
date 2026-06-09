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
import { getContractById } from "../../services/contractService"
import moment from "moment"
import { FileText, Printer, Check, ShieldCheck } from "lucide-react"

function ContractDetailModal({ visible, onClose, contractId }) {
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && contractId) {
      loadContract()
    }
  }, [visible, contractId])

  const loadContract = async () => {
    setLoading(true)
    try {
      const data = await getContractById(contractId)
      setContract(data)
    } catch (err) {
      console.error("Failed to load contract detail", err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ kích hoạt'
      case 'Active': return 'Đang hoạt động'
      case 'Expired': return 'Đã hết hạn'
      case 'Cancelled': return 'Đã hủy bỏ'
      default: return status
    }
  }

  const getInvoiceText = (status) => {
    switch (status) {
      case 'Pending': return 'Chưa thanh toán'
      case 'Paid': return 'Đã thanh toán'
      case 'Overdue': return 'Quá hạn'
      case 'Cancelled': return 'Đã hủy'
      default: return status || 'N/A'
    }
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" alignment="center" scrollable>
      <CModalHeader closeButton className="border-0 pb-0 bg-light">
        <CModalTitle className="fw-bold fs-5 d-flex align-items-center gap-2 text-dark">
          <FileText className="text-warning" size={20} />
          Hợp Đồng Điện Tử #{contractId?.slice(-10).toUpperCase()}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="bg-light p-4">
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="warning" />
            <div className="mt-2 text-muted">Đang tải bản hợp đồng...</div>
          </div>
        ) : contract ? (
          /* Paper Contract Sheet */
          <div className="bg-white p-5 rounded-3 shadow-sm border mx-auto text-dark" style={{
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

            {/* Contract Title */}
            <div className="text-center mb-5">
              <h4 className="fw-bold mb-2" style={{ letterSpacing: "1px", color: "#111" }}>HỢP ĐỒNG DỊCH VỤ HỘI VIÊN</h4>
              <div className="text-muted small">Số: {contract.contractId?.slice(-10).toUpperCase()}/HĐDV-ENERGYM</div>
              <div className="text-muted small">Ngày lập: {moment(contract.createdAt).format("DD/MM/YYYY")}</div>
            </div>

            {/* Intro text */}
            <p className="mb-4 text-justify">
              Căn cứ Bộ luật Dân sự nước Cộng hòa Xã hội Chủ nghĩa Việt Nam;<br />
              Căn cứ nhu cầu sử dụng dịch vụ rèn luyện thể chất và sự tự nguyện của khách hàng;<br />
              Hôm nay, ngày {moment(contract.createdAt).format("DD")} tháng {moment(contract.createdAt).format("MM")} năm {moment(contract.createdAt).format("YYYY")}, chúng tôi gồm các bên dưới đây:
            </p>

            {/* PARTY A */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>BÊN A: BÊN CUNG CẤP DỊCH VỤ (ENERGYM)</h6>
              <div className="row g-1 ps-2">
                <div className="col-12"><span className="fw-semibold">Đơn vị:</span> CÔNG TY CỔ PHẦN ENERGYM VIỆT NAM</div>
                <div className="col-12"><span className="fw-semibold">Trụ sở chính:</span> Tòa nhà EnerGym, Hà Nội, Việt Nam</div>
                <div className="col-12"><span className="fw-semibold">Điện thoại:</span> 1900 1234 | <span className="fw-semibold">Email:</span> contact@energym.vn</div>
                <div className="col-12"><span className="fw-semibold">Đại diện pháp luật:</span> Ông Nguyễn Đăng Khoa - Chức vụ: Giám đốc điều hành</div>
              </div>
            </div>

            {/* PARTY B */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>BÊN B: KHÁCH HÀNG (HỘI VIÊN)</h6>
              <div className="row g-2 ps-2">
                <div className="col-md-6"><span className="fw-semibold">Họ tên hội viên:</span> {contract.memberName}</div>
                <div className="col-md-6"><span className="fw-semibold">Mã hội viên:</span> {contract.memberUserId?.slice(-10).toUpperCase()}</div>
                <div className="col-12"><span className="fw-semibold">Hình thức định danh:</span> Xác nhận tài khoản điện tử qua hệ thống</div>
              </div>
            </div>

            {/* TERMS */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>ĐIỀU KHOẢN HỢP ĐỒNG</h6>
              
              <div className="ps-2">
                <div className="mb-3">
                  <span className="fw-bold">Điều 1: Nội dung dịch vụ đăng ký</span>
                  <ul className="mb-2 list-unstyled ps-3">
                    <li>- <span className="fw-semibold">Gói tập đăng ký:</span> <span className="text-primary fw-bold">{contract.packageName}</span></li>
                    <li>- <span className="fw-semibold">Thời hạn sử dụng:</span> Từ ngày {moment(contract.startDate).format("DD/MM/YYYY")} đến hết ngày {moment(contract.endDate).format("DD/MM/YYYY")}</li>
                    <li>- <span className="fw-semibold">Số buổi Huấn luyện viên cá nhân (PT):</span> {contract.totalPrivateSessions} buổi (Đã sử dụng: {contract.usedPrivateSessions} buổi)</li>
                    <li>- <span className="fw-semibold">Số lớp tập nhóm (Group Class):</span> {contract.totalGroupSessions} buổi (Đã sử dụng: {contract.usedGroupSessions} buổi)</li>
                    <li>- <span className="fw-semibold">Trạng thái hợp đồng hiện tại:</span> <span className="fw-bold">{getStatusText(contract.status)}</span></li>
                  </ul>
                </div>

                <div className="mb-3">
                  <span className="fw-bold">Điều 2: Giá trị hợp đồng & Thanh toán</span>
                  <table className="table table-bordered table-sm mt-2 text-center" style={{ fontSize: "14px" }}>
                    <thead>
                      <tr className="table-light">
                        <th>Giá niêm yết</th>
                        <th>Chiết khấu khuyến mại</th>
                        <th>Giá trị thanh toán thực tế</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{formatCurrency(contract.originalPrice)}</td>
                        <td className="text-danger">-{formatCurrency(contract.discountAmount)}</td>
                        <td className="fw-bold text-success">{formatCurrency(contract.dealPrice)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="small mt-1">
                    <span className="fw-semibold">Trạng thái thanh toán:</span> {getInvoiceText(contract.invoiceStatus)}
                  </div>
                </div>

                <div>
                  <span className="fw-bold">Điều 3: Cam kết chung</span>
                  <p className="mb-0 text-justify text-muted small" style={{ fontStyle: "italic" }}>
                    Bên B cam kết tuân thủ đầy đủ các nội quy, quy định chung của hệ thống phòng tập EnerGym. 
                    Hợp đồng dịch vụ này được ký kết dựa trên sự đồng thuận điện tử tự nguyện của hai bên, có đầy đủ giá trị pháp lý tương đương văn bản giấy kể từ thời điểm Bên B hoàn tất thủ tục thanh toán.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="row mt-5 pt-3 g-4 text-center">
              {/* Party A Representative */}
              <div className="col-6 position-relative">
                <div className="fw-bold">ĐẠI DIỆN BÊN A</div>
                <div className="text-muted small mb-4">(Ký, ghi rõ họ tên & đóng dấu)</div>
                
                {/* Mock Digital Seal */}
                {contract.invoiceStatus === 'Paid' && (
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
                    <span>{moment(contract.createdAt).format("DD/MM/YYYY")}</span>
                  </div>
                )}
                <div className="fw-bold text-dark mt-5 pt-4">Nguyễn Đăng Khoa</div>
                <div className="small text-muted">Giám đốc điều hành</div>
              </div>

              {/* Party B Client */}
              <div className="col-6">
                <div className="fw-bold">HỘI VIÊN BÊN B</div>
                <div className="text-muted small mb-4">(Ký & ghi rõ họ tên)</div>
                
                {contract.invoiceStatus === 'Paid' ? (
                  <div className="d-flex flex-column align-items-center justify-content-center text-success mt-4 pt-1" style={{ minHeight: "60px" }}>
                    <ShieldCheck size={28} className="text-success mb-1" />
                    <span className="fw-bold small" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>XÁC THỰC ĐIỆN TỬ</span>
                    <span className="small text-muted" style={{ fontSize: "10px" }}>ID: {contract.memberUserId?.slice(-8).toUpperCase()}</span>
                  </div>
                ) : (
                  <div className="text-muted mt-5 pt-3 small" style={{ fontStyle: "italic" }}>
                    Chờ thanh toán xác nhận hợp đồng
                  </div>
                )}
                
                <div className="fw-bold text-dark mt-4">{contract.memberName}</div>
                <div className="small text-muted">Khách hàng</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">Không tìm thấy thông tin hợp đồng.</div>
        )}
      </CModalBody>

      <CModalFooter className="border-0 bg-light">
        <CButton color="primary" className="px-4 fw-bold shadow-sm text-white" onClick={handlePrint}>
          In Hợp Đồng
        </CButton>
        <CButton color="secondary" variant="outline" onClick={onClose} className="px-4 fw-bold bg-white">
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ContractDetailModal
