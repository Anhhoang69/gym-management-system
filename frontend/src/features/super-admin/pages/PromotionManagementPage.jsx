import { useState, useEffect } from "react"

import StatsCards from "../components/StatsCards"
import PromotionTable from "../components/PromotionTable"
import Pagination from "../components/Pagination"
import EditPromotionModal from "../components/EditPromotionModal"
import CreatePromotionModal from "../components/CreatePromotionModal"
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"

import {
  CToast,
  CToastBody,
  CToaster
} from "@coreui/react"

import {
  getPromotions,
  getPromotionStats,
  getPromotionById,
  updatePromotion,
  deletePromotion
} from "../services/promotionService"

import {
  cilTag,
  cilCheckCircle,
  cilClock,
  cilBan
} from "@coreui/icons"

function PromotionManagementPage() {

  const [promotions, setPromotions] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPromo, setEditingPromo] = useState(null)

  const [showCreateModal, setShowCreateModal] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingPromo, setDeletingPromo] = useState(null)

  const [toast, setToast] = useState(null)

  const pageSize = 10
  const [page, setPage] = useState(1)

  const [statsData, setStatsData] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    expired: 0
  })

  const loadStats = async () => {

    try {

      const data = await getPromotionStats()

      setStatsData(data)

    } catch (err) {

      console.error("Load promotion stats failed:", err)

    }

  }

  const loadPromotions = async () => {

    try {

      const data = await getPromotions()

      const mapped = data.map((p) => {

        const discount =
          p.discountType === "Percentage"
            ? `${p.discountValue}%`
            : `$${p.discountValue}`

        const start =
          p.startDate && p.startDate !== "0001-01-01T00:00:00"
            ? new Date(p.startDate).toLocaleDateString()
            : "-"

        const end =
          p.endDate && p.endDate !== "0001-01-01T00:00:00"
            ? new Date(p.endDate).toLocaleDateString()
            : "-"

        return {

          id: p.promotionId,

          name: p.name,
          code: p.code,

          discountType: p.discountType,
          discountValue: p.discountValue ?? "",

          type: p.discountType,
          value: discount,

          startDate: p.startDate,
          endDate: p.endDate,

          start,
          end,

          branch: p.branchName || "All Branches",

          applicableBranchId: p.applicableBranchId || "",

          contractType: p.contractType,

          usage: p.currentUsage ?? 0,
          maxUsage: p.maxUsage ?? "",

          status: p.status?.toLowerCase()

        }

      })

      setPromotions(mapped)

      // tránh pagination vượt giới hạn
      const newTotalPages = Math.ceil(mapped.length / pageSize)
      if (page > newTotalPages) setPage(1)

    } catch (err) {

      console.error("Load promotions failed:", err)

    }

  }

  useEffect(() => {

    loadPromotions()

  }, [])

  useEffect(() => {

    loadStats()

  }, [])

  const stats = [

    {
      title: "Tổng Mã Khuyến Mãi",
      value: statsData.total,
      icon: cilTag,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },

    {
      title: "Đang Hoạt Động",
      value: statsData.active,
      icon: cilCheckCircle,
      bg: "#DCFCE7",
      color: "#22C55E"
    },

    {
      title: "Sắp Hết Hạn",
      value: statsData.scheduled,
      icon: cilClock,
      bg: "#FFEAD5",
      color: "#FB923C"
    },

    {
      title: "Đã Hết Hạn",
      value: statsData.expired,
      icon: cilBan,
      bg: "#FEE2E2",
      color: "#EF4444"
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

  const handleEdit = async (promo) => {

    try {

      const p = await getPromotionById(promo.id)

      const mapped = {

        id: p.promotionId,
        name: p.name,
        code: p.code,

        discountType: p.discountType,
        discountValue: p.discountValue,

        applicableBranchId: p.applicableBranchId,
        contractType: p.contractType,

        startDate: p.startDate,
        endDate: p.endDate,

        maxUsage: p.maxUsage,

        currentUsage: p.currentUsage,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        createdByName: p.createdByName,

        status: p.status

      }

      setEditingPromo(mapped)

      setShowEditModal(true)

    } catch (err) {

      console.error("Load promotion detail failed:", err)

    }

  }

  const handleUpdate = async (id, payload) => {

    try {

      await updatePromotion(id, payload)

      setShowEditModal(false)

      setToast(
        <CToast autohide delay={3000} color="success">
          <CToastBody>
            Cập nhật khuyến mãi thành công
          </CToastBody>
        </CToast>
      )

      await loadPromotions()
      await loadStats()

    } catch (err) {

      console.error("Update promotion failed:", err)

    }

  }

  const handleDelete = (promo) => {

    setDeletingPromo(promo)
    setShowDeleteModal(true)

  }

  const confirmDelete = async () => {

    if (!deletingPromo) return

    try {

      await deletePromotion(deletingPromo.id)

      setShowDeleteModal(false)
      setDeletingPromo(null)

      setToast(
        <CToast autohide delay={3000} color="success">
          <CToastBody>
            Đã xoá khuyến mãi thành công
          </CToastBody>
        </CToast>
      )

      await loadPromotions()
      await loadStats()

    } catch (err) {

      console.error("Delete promotion failed:", err)

    }

  }

  return (

    <div>

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

      <StatsCards stats={stats} />

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

      <div className="mt-4 d-flex justify-content-end">

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />

      </div>

      <CreatePromotionModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
      />

      <EditPromotionModal
        visible={showEditModal}
        setVisible={setShowEditModal}
        promotion={editingPromo}
        onUpdate={handleUpdate}
      />

      <ConfirmDeleteModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onConfirm={confirmDelete}
        itemName={deletingPromo?.name}
      />

      <CToaster placement="top-end">
        {toast}
      </CToaster>

    </div>

  )

}

export default PromotionManagementPage
 
