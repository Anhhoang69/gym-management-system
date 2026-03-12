import { useState } from "react"

import StatsCards from "../components/StatsCards"
import PromotionTable from "../components/PromotionTable"
import Pagination from "../components/Pagination"
import EditPromotionModal from "../components/EditPromotionModal"
import CreatePromotionModal from "../components/CreatePromotionModal"

import {
  cilTag,
  cilCheckCircle,
  cilClock,
  cilBan
} from "@coreui/icons"

const MOCK_PROMOTIONS = [
  { id: 1, name: "Summer Blast", code: "SUMMER25", type: "Percentage", value: "25%", validity: "Jun 1 - Aug 31", status: "active" },
  { id: 2, name: "New Member Special", code: "NEWBIE50", type: "Flat Discount", value: "$50", validity: "Jul 15 - Dec 31", status: "scheduled" },
  { id: 3, name: "Spring Training", code: "SPRING20", type: "Percentage", value: "20%", validity: "Mar 1 - May 31", status: "expired" },
  { id: 4, name: "Black Friday Mega", code: "BF40", type: "Percentage", value: "40%", validity: "Nov 20 - Nov 30", status: "scheduled" },
  { id: 5, name: "Holiday Fitness", code: "HOLIDAY30", type: "Percentage", value: "30%", validity: "Dec 1 - Dec 31", status: "scheduled" },
  { id: 6, name: "Early Bird Promo", code: "EARLY15", type: "Percentage", value: "15%", validity: "Jan 1 - Jan 31", status: "expired" },
  { id: 7, name: "Student Discount", code: "STUDENT10", type: "Percentage", value: "10%", validity: "All Year", status: "active" },
  { id: 8, name: "Weekend Workout", code: "WEEKEND20", type: "Flat Discount", value: "$20", validity: "All Weekends", status: "active" },
  { id: 9, name: "Anniversary Deal", code: "ANNIV35", type: "Percentage", value: "35%", validity: "Apr 10 - Apr 30", status: "expired" },
  { id: 10, name: "Flash Sale", code: "FLASH50", type: "Flat Discount", value: "$50", validity: "One Day Only", status: "scheduled" },
  { id: 11, name: "VIP Member Bonus", code: "VIP25", type: "Percentage", value: "25%", validity: "All Year", status: "active" }
]

function PromotionManagementPage() {

  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS)
  const [selectedIds, setSelectedIds] = useState([])

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPromo, setEditingPromo] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)

  const pageSize = 10
  const [page, setPage] = useState(1)

  const stats = [
    {
      title: "Tổng Mã Khuyến Mãi",
      value: "24",
      icon: cilTag,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },
    {
      title: "Đang Hoạt Động",
      value: "18",
      change: "+3 so với tháng trước",
      icon: cilCheckCircle,
      bg: "#DCFCE7",
      color: "#22C55E",
      positive: true
    },
    {
      title: "Sắp Hết Hạn",
      value: "4",
      icon: cilClock,
      bg: "#FFEAD5",
      color: "#FB923C"
    },
    {
      title: "Đã Hết Hạn",
      value: "2",
      icon: cilBan,
      bg: "#FEE2E2",
      color: "#EF4444",
      positive: false
    }
  ]

  const totalPages = Math.ceil(promotions.length / pageSize)

  const start = (page - 1) * pageSize

  const currentPromotions =
    promotions.slice(start, start + pageSize)

  const toggleSelect = (id) => {

    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )

  }

  const toggleSelectAll = (checked) => {

    if (checked) {
      setSelectedIds(currentPromotions.map(p => p.id))
    } else {
      setSelectedIds([])
    }

  }

  const handleEdit = (promo) => {

    setEditingPromo(promo)
    setShowEditModal(true)

  }

  const handleUpdatePromo = (updatedPromo) => {

    setPromotions(prev =>
      prev.map(p =>
        p.id === updatedPromo.id ? updatedPromo : p
      )
    )

  }

  const handleCreatePromo = (newPromo) => {

    setPromotions(prev => [newPromo, ...prev])

  }

  const handleDelete = (promo) => {

    setPromotions(prev =>
      prev.filter(p => p.id !== promo.id)
    )

  }

  return (
    <div>

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Quản Lý Mã Giảm Giá</h3>
          <p className="text-muted mb-0">
            Quản lý tất cả các khuyến mãi cho phòng tập
          </p>
        </div>

        <button
          className="btn btn-warning px-4 fw-semibold"
          onClick={() => setShowCreateModal(true)}
        >
          + Thêm Mã Mới
        </button>

      </div>

      {/* Stats */}

      <StatsCards stats={stats} />

      {/* Table */}

      <div className="mt-4">

        <PromotionTable
          promotions={currentPromotions}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
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

      {/* Create Modal */}

      <CreatePromotionModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
        onCreate={handleCreatePromo}
      />

      {/* Edit Modal */}

      <EditPromotionModal
        visible={showEditModal}
        setVisible={setShowEditModal}
        promotion={editingPromo}
        onUpdate={handleUpdatePromo}
      />

    </div>
  )
}

export default PromotionManagementPage