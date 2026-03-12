import { CCard, CCardBody } from "@coreui/react"

function BranchCard({ branch,onViewDetail }) {

  return (

    <CCard className="shadow-sm">

      <img
        src={branch.image}
        style={{
          width: "100%",
          height: 200,
          objectFit: "cover",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      />

      <CCardBody>

        <h5 className="fw-bold">{branch.name}</h5>
        <p className="text-muted mb-2">{branch.address}</p>

        <span className="badge bg-success mb-3">
          Hoạt động
        </span>

        <div className="row small">

          <div className="col-6">
            <p className="mb-1 text-muted">Phòng:</p>
            <b>{branch.rooms}</b>
          </div>

          <div className="col-6">
            <p className="mb-1 text-muted">Thành viên:</p>
            <b>{branch.members}</b>
          </div>

          <div className="col-6 mt-2">
            <p className="mb-1 text-muted">Sức chứa:</p>
            <b>{branch.capacity}</b>
          </div>

          <div className="col-6 mt-2">
            <p className="mb-1 text-muted">Quản lý:</p>
            <b>{branch.manager}</b>
          </div>

        </div>

        <button
          className="btn btn-warning w-100 mt-3 fw-semibold"
          onClick={()=>onViewDetail(branch)}
        >
          Xem Chi Tiết
        </button>

      </CCardBody>

    </CCard>

  )
}

export default BranchCard