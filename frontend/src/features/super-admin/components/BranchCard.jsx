import { CCard, CCardBody, CBadge } from "@coreui/react"
import {
  cilHome,
  cilPeople,
  cilWalk,
  cilPhone
} from "@coreui/icons"
import CIcon from "@coreui/icons-react"

function BranchCard({ branch, onViewDetail }) {

  const statusColor =
    branch.status === "active"
      ? "success"
      : "secondary"

  const statusText =
    branch.status === "active"
      ? "Hoạt động"
      : "Ngừng hoạt động"

  const image =
    branch.image ||
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"

  return (

    <CCard
      className="shadow-sm border-0"
      style={{
        transition: "all .2s",
        cursor: "pointer"
      }}
    >

      <img
        src={image}
        style={{
          width: "100%",
          height: 200,
          objectFit: "cover",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      />

      <CCardBody>

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <h5 className="fw-bold mb-1">{branch.name}</h5>
            <p className="text-muted small mb-2">{branch.address}</p>
          </div>

          <CBadge color={statusColor}>
            {statusText}
          </CBadge>

        </div>

        <div className="row mt-3 text-center">

          <div className="col-6 mb-3">
            <CIcon icon={cilHome} className="text-warning mb-1" />
            <div className="small text-muted">Phòng</div>
            <b>{branch.totalRooms}</b>
          </div>

          <div className="col-6 mb-3">
            <CIcon icon={cilPeople} className="text-info mb-1" />
            <div className="small text-muted">Nhân viên</div>
            <b>{branch.totalStaff}</b>
          </div>

          <div className="col-6">
            <CIcon icon={cilWalk} className="text-success mb-1" />
            <div className="small text-muted">Checkin hôm nay</div>
            <b>{branch.totalCheckinsToday}</b>
          </div>

          <div className="col-6">
            <CIcon icon={cilPhone} className="text-secondary mb-1" />
            <div className="small text-muted">Hotline</div>
            <b>{branch.hotline || "-"}</b>
          </div>

        </div>

        <button
          className="btn btn-warning w-100 mt-4 fw-semibold"
          onClick={() => onViewDetail(branch)}
        >
          Xem Chi Tiết
        </button>

      </CCardBody>

    </CCard>

  )

}

export default BranchCard