import { useState } from "react"

import StatsCards from "../components/StatsCards"
import BranchGrid from "../components/BranchGrid"
import Pagination from "../components/Pagination"
import CreateBranchModal from "../components/CreateBranchModal"
import BranchDetailModal from "../components/BranchDetailModal"

import {
  cilLocationPin,
  cilPeople,
  cilChartLine
} from "@coreui/icons"

function BranchManagementPage() {

  const [showCreateModal, setShowCreateModal] = useState(false)

  const [showDetailModal,setShowDetailModal]=useState(false)
  const [selectedBranch,setSelectedBranch]=useState(null)

  const stats = [
    {
      title: "Tổng Chi Nhánh",
      value: "4",
      icon: cilLocationPin,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },
    {
      title: "Tổng Sức Chứa",
      value: "2,200",
      icon: cilPeople,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },
    {
      title: "Thành Viên Hoạt Động",
      value: "1,610",
      icon: cilPeople,
      bg: "#DCFCE7",
      color: "#22C55E"
    },
    {
      title: "Tỷ Lệ Lấp Đầy TB",
      value: "73%",
      icon: cilChartLine,
      bg: "#DBEAFE",
      color: "#3B82F6"
    }
  ]

  const branches = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `Branch ${i + 1}`,
    address: "City Center",
    rooms: 10,
    members: 300 + i * 10,
    capacity: 600,
    manager: "John Smith",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"
  }))

  const pageSize = 2
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(branches.length / pageSize)

  const start = (page - 1) * pageSize
  const currentBranches = branches.slice(start, start + pageSize)

  const handleViewDetail=(branch)=>{

    setSelectedBranch(branch)
    setShowDetailModal(true)

  }

  return (
    <div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Quản Lý Chi Nhánh</h3>
          <p className="text-muted mb-0">
            Quản lý tất cả các chi nhánh phòng tập
          </p>
        </div>

        <button
          className="btn btn-warning px-4 fw-semibold"
          onClick={() => setShowCreateModal(true)}
        >
          + Thêm Chi Nhánh Mới
        </button>

      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Branch cards */}
      <div className="mt-4">
        <BranchGrid
          branches={currentBranches}
          onViewDetail={handleViewDetail}
        />
      </div>

      {/* Pagination */}
      <div className="mt-4 d-flex justify-content-end">

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />

      </div>

      {/* Create Branch Modal */}
      <CreateBranchModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
      />

      {/* Detail Modal */}
      <BranchDetailModal
        visible={showDetailModal}
        setVisible={setShowDetailModal}
        branch={selectedBranch}
      />

    </div>
  )
}

export default BranchManagementPage