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
import { getDraftContractById, generateContract } from "../../services/contractService"
import { createInvoice } from "../../services/invoiceService"
import moment from "moment"
import { FileText, Clock, Award, ArrowRight, ShieldAlert } from "lucide-react"

function DraftDetailModal({ visible, onClose, draftId, onContractCreated }) {
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(false)
  const [signing, setSigning] = useState(false)

  useEffect(() => {
    if (visible && draftId) {
      loadDraft()
    }
  }, [visible, draftId])

  const loadDraft = async () => {
    setLoading(true)
    try {
      const data = await getDraftContractById(draftId)
      setDraft(data)
    } catch (err) {
      console.error("Failed to load draft detail", err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  }

  const handleSign = async () => {
    if (!draft) return
    setSigning(true)
    try {
      let result = await generateContract({ draftId: draft.draftId })
      
      // Auto-issue invoice if backend didn't generate one
      if (result && !result.invoiceId && (result.contractId || result.id)) {
        try {
          const invoiceRes = await createInvoice({ contractId: result.contractId || result.id })
          if (invoiceRes && invoiceRes.invoiceId) {
            result = { ...result, invoiceId: invoiceRes.invoiceId }
          }
        } catch (invErr) {
          console.error("Failed to auto-issue invoice in draft details", invErr)
        }
      }

      if (onContractCreated) {
        onContractCreated(result)
      }
      onClose()
    } catch (err) {
      console.error("Failed to sign draft:", err)
      alert("Không thể ký hợp đồng từ bản nháp này.")
    } finally {
      setSigning(false)
    }
  }

  const isExpired = draft ? moment().isAfter(moment(draft.expiresAt)) : false

  return (
    <CModal visible={visible} onClose={onClose} size="lg" backdrop="static" alignment="center" scrollable>
      <CModalHeader closeButton className="border-0 pb-0 bg-light">
        <CModalTitle className="fw-bold fs-5 d-flex align-items-center gap-2 text-dark">
          <FileText className="text-secondary" size={20} />
          Xem Bản Nháp Hợp Đồng #{draftId?.slice(-10).toUpperCase()}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="bg-light p-4">
        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="warning" />
            <div className="mt-2 text-muted">Đang tải bản nháp...</div>
          </div>
        ) : draft ? (
          /* Paper Contract Sheet */
          <div className="bg-white p-5 rounded-3 shadow-sm border mx-auto text-dark position-relative" style={{
            maxWidth: "720px",
            fontFamily: "'Times New Roman', Times, serif",
            lineHeight: 1.6,
            fontSize: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}>
            {/* Watermark for draft */}
            <div 
              className="position-absolute start-50 top-50 translate-middle text-uppercase text-muted select-none text-center"
              style={{
                fontSize: "76px",
                fontWeight: "900",
                opacity: 0.04,
                transform: "translate(-50%, -50%) rotate(-25deg)",
                pointerEvents: "none",
                zIndex: 0,
                letterSpacing: "4px"
              }}
            >
              BẢN NHÁP<br />DRAFT
            </div>

            <div className="position-relative" style={{ zIndex: 1 }}>
              {/* National Motto / Header */}
              <div className="text-center mb-4">
                <h5 className="fw-bold mb-1" style={{ letterSpacing: "0.5px" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
                <div className="fw-semibold small mb-2">Độc lập - Tự do - Hạnh phúc</div>
                <div style={{ width: "160px", borderBottom: "1.5px solid #000", margin: "0 auto 20px" }}></div>
              </div>

              {/* Contract Title */}
              <div className="text-center mb-5">
                <h4 className="fw-bold mb-2 text-uppercase" style={{ letterSpacing: "1px", color: "#111" }}>Bản Nháp Hợp Đồng Dịch Vụ Hội Viên</h4>
                <div className="text-muted small">Số: {draft.draftId?.slice(-10).toUpperCase()}/HĐDV-ENERGYM-DRAFT</div>
                <div className="text-muted small">Hạn lưu nháp: {moment(draft.expiresAt).format("DD/MM/YYYY HH:mm")}</div>
              </div>

              {/* Intro text */}
              <p className="mb-4 text-justify">
                Căn cứ Bộ luật Dân sự nước Cộng hòa Xã hội Chủ nghĩa Việt Nam;<br />
                Căn cứ nhu cầu sử dụng dịch vụ rèn luyện thể chất và sự tự nguyện của khách hàng;<br />
                Hôm nay, ngày {moment().format("DD")} tháng {moment().format("MM")} năm {moment().format("YYYY")}, chúng tôi thiết lập thông tin bản nháp cấu hình dịch vụ hội viên gồm các điều khoản dưới đây:
              </p>

              {/* PARTY A */}
              <div className="mb-4">
                <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>BÊN A: BÊN CUNG CẤP DỊCH VỤ (ENERGYM)</h6>
                <div className="row g-1 ps-2">
                  <div className="col-12"><span className="fw-semibold">Đơn vị:</span> CÔNG TY CỔ PHẦN ENERGYM VIỆT NAM</div>
                  <div className="col-12"><span className="fw-semibold">Trụ sở chính:</span> Tòa nhà EnerGym, Hà Nội, Việt Nam</div>
                  <div className="col-12"><span className="fw-semibold">Điện thoại:</span> 1900 1234 | <span className="fw-semibold">Email:</span> contact@energym.vn</div>
                </div>
              </div>

              {/* PARTY B */}
              <div className="mb-4">
                <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>BÊN B: KHÁCH HÀNG (HỘI VIÊN)</h6>
                <div className="row g-2 ps-2">
                  <div className="col-md-12"><span className="fw-semibold">Họ tên hội viên:</span> {draft.memberName}</div>
                  <div className="col-md-12"><span className="fw-semibold">Hình thức định danh:</span> Cấu hình trước khi ký kết tài khoản điện tử</div>
                </div>
              </div>

              {/* TERMS */}
              <div className="mb-4">
                <h6 className="fw-bold text-uppercase mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "4px" }}>ĐIỀU KHOẢN HỢP ĐỒNG DỰ THẢO</h6>
                
                <div className="ps-2">
                  <div className="mb-3">
                    <span className="fw-bold">Điều 1: Nội dung dịch vụ đăng ký dự kiến</span>
                    <ul className="mb-2 list-unstyled ps-3">
                      <li>- <span className="fw-semibold">Gói tập đăng ký:</span> <span className="text-primary fw-bold">{draft.packageName}</span></li>
                      <li>- <span className="fw-semibold">Thời hạn sử dụng:</span> {draft.durationMonths} Tháng (Dự kiến từ {moment(draft.startDate).format("DD/MM/YYYY")} đến {moment(draft.endDate).format("DD/MM/YYYY")})</li>
                      <li>- <span className="fw-semibold">Trạng thái hiện tại:</span> <span className="text-muted fw-bold">Bản nháp cấu hình</span></li>
                    </ul>
                  </div>

                  <div className="mb-3">
                    <span className="fw-bold">Điều 2: Giá trị gói tập & Khuyến mại áp dụng</span>
                    <table className="table table-bordered table-sm mt-2 text-center" style={{ fontSize: "14px" }}>
                      <thead>
                        <tr className="table-light">
                          <th>Giá niêm yết gốc</th>
                          <th>Chiết khấu giảm giá</th>
                          <th>Tổng tiền thực tế thanh toán</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{formatCurrency(draft.originalPrice)}</td>
                          <td className="text-danger">-{formatCurrency(draft.discountAmount)}</td>
                          <td className="fw-bold text-success">{formatCurrency(draft.dealPrice)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Applied Promotions list */}
                    {draft.appliedPromotions && draft.appliedPromotions.length > 0 && (
                      <div className="mt-2">
                        <div className="small text-muted mb-1"><Award size={13} className="text-success d-inline align-text-bottom me-1" /> Khuyến mại áp dụng:</div>
                        <div className="d-flex flex-wrap gap-1">
                          {draft.appliedPromotions.map((promo, idx) => (
                            <CBadge key={idx} color="success" shape="rounded-pill" className="px-2 py-1 small">
                              {promo}
                            </CBadge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="fw-bold">Điều 3: Cam kết & Hiệu lực lưu trữ</span>
                    <p className="mb-0 text-justify text-muted small" style={{ fontStyle: "italic" }}>
                      Bản nháp hợp đồng dịch vụ này chỉ có giá trị lưu giữ thông tin cấu hình giá cả phòng tập EnerGym tối đa cho tới thời điểm hết hạn lưu nháp (<span className="fw-bold">{moment(draft.expiresAt).format("DD/MM/YYYY HH:mm")}</span>). 
                      Thông tin này chưa cấu thành hợp đồng chính thức và không có hiệu lực mở thẻ hay kích hoạt dịch vụ cho tới khi Bên B thực hiện ký hợp đồng và hoàn tất các thủ tục đóng tiền.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="row mt-5 pt-3 g-4 text-center">
                {/* Party A Representative */}
                <div className="col-6">
                  <div className="fw-bold">ĐẠI DIỆN BÊN A</div>
                  <div className="text-muted small mb-4">(Chưa ký số)</div>
                  <div className="text-muted mt-4 pt-1 small" style={{ fontStyle: "italic" }}>
                    Chờ Bên B xác nhận bản nháp
                  </div>
                </div>

                {/* Party B Client */}
                <div className="col-6">
                  <div className="fw-bold">HỘI VIÊN BÊN B</div>
                  <div className="text-muted small mb-4">(Chưa xác nhận)</div>
                  
                  <div className="d-flex flex-column align-items-center justify-content-center text-warning mt-3 pt-1" style={{ minHeight: "50px" }}>
                    <ShieldAlert size={26} className="text-warning mb-1" />
                    <span className="fw-bold small" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>CHỜ XÁC THỰC KÝ HĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">Không tìm thấy thông tin bản nháp.</div>
        )}
      </CModalBody>

      <CModalFooter className="border-0 bg-light">
        <CButton color="secondary" variant="outline" onClick={onClose} className="px-4 fw-bold bg-white">
          Đóng
        </CButton>
        {draft && !isExpired && (
          <CButton 
            color="success" 
            className="px-4 fw-bold text-white shadow-sm d-flex align-items-center gap-1"
            onClick={handleSign}
            disabled={signing}
          >
            {signing ? <CSpinner size="sm" /> : null}
            Ký & Phát hành Hợp đồng
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default DraftDetailModal
