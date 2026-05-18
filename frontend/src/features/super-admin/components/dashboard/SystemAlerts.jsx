import { CCard, CCardBody, CAlert } from "@coreui/react"

function SystemAlerts() {
  return (
    <CCard>
      <CCardBody>

        <div className="d-flex justify-content-between mb-3">
          <h5>Cảnh Báo Hệ Thống</h5>
          <span className="text-danger">2 Cảnh báo</span>
        </div>

        <CAlert color="danger">
          <strong>Bảo trì thiết bị đến hạn</strong>
          <div>Máy chạy bộ #3 yêu cầu bảo trì theo lịch trình</div>
        </CAlert>

        <CAlert color="warning">
          <strong>Thẻ thành viên sắp hết hạn</strong>
          <div>12 thẻ thành viên hết hạn trong tuần này</div>
        </CAlert>

      </CCardBody>
    </CCard>
  )
}

export default SystemAlerts