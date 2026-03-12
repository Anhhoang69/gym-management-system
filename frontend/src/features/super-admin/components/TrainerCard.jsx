import { CCard, CCardBody } from "@coreui/react"

function TrainerCard({ trainer }) {

  return (
    <CCard className="h-100 shadow-sm border-0">

      <img
        src={trainer.avatar}
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover"
        }}
      />

      <CCardBody>

        <h5 className="fw-bold">{trainer.name}</h5>
        <p className="text-muted small mb-2">
          {trainer.specialty}
        </p>

        <p className="small mb-1">
          👥 {trainer.members} thành viên
        </p>

        <p className="small mb-3">
          ⭐ {trainer.rating}
        </p>

        {/* ACTIONS */}
        <div className="d-flex gap-2">

          <button className="btn btn-light w-100">
            Xem
          </button>

          <button className="btn btn-light w-100">
            Sửa
          </button>

          <button className="btn btn-light text-danger w-100">
            Xóa
          </button>

        </div>

      </CCardBody>

    </CCard>
  )
}

export default TrainerCard