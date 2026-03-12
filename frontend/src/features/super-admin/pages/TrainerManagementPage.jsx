import { useState } from "react"
import TrainerGrid from "../components/TrainerGrid.jsx"
import Pagination from "../components/Pagination"

function TrainerManagementPage() {

  const trainers = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `Trainer ${i + 1}`,
    specialty: "Strength Training",
    members: 25 + i,
    rating: 4.5,
    avatar: "https://i.pravatar.cc/300"
  }))

  const pageSize = 4
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(trainers.length / pageSize)

  const start = (page - 1) * pageSize
  const current = trainers.slice(start, start + pageSize)

  return (
    <div>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Quản Lý Huấn Luyện Viên</h3>
          <p className="text-muted mb-0">
            Quản lý thông tin và hoạt động của các huấn luyện viên
          </p>
        </div>

        <button className="btn btn-warning px-4 fw-semibold">
          + Thêm Huấn Luyện Viên
        </button>

      </div>

      {/* GRID */}
      <TrainerGrid trainers={current} />

      {/* PAGINATION */}
      <div className="mt-4 d-flex justify-content-end">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>

    </div>
  )
}

export default TrainerManagementPage