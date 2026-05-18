import { useState, useEffect } from "react"
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton } from "@coreui/react"

import StatsCards from "../components/common/StatsCards"
import BranchGrid from "../components/branch-management/BranchGrid"
import Pagination from "../components/common/Pagination"
import CreateBranchModal from "../components/branch-management/CreateBranchModal"
import BranchDetailModal from "../components/branch-management/BranchDetailModal"
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal"

import {
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchStats
} from "../services/branchService"

import {
  cilLocationPin,
  cilPeople,
  cilChartLine
} from "@coreui/icons"

function BranchManagementPage() {

  const [showCreateModal, setShowCreateModal] = useState(false)

  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)

  const [branches, setBranches] = useState([])

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingBranch, setDeletingBranch] = useState(null)

  const [page, setPage] = useState(1)
  const pageSize = 4

  const [apiStats, setApiStats] = useState({
    totalBranches: 0,
    activeBranches: 0,
    pendingBranches: 0,
    inactiveBranches: 0
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const loadStats = async () => {
    try {
      const data = await getBranchStats()
      setApiStats(data)
    } catch (err) {
      console.error("Load branch stats failed:", err)
    }
  }

  const loadBranches = async () => {


    try {

      const data = await getBranches()

      const mapped = data.map(b => ({

        id: b.branchId,

        name: b.name,
        address: b.address,

        email: b.email,
        hotline: b.hotline,

        status: b.status?.toLowerCase(),

        totalRooms: b.totalRooms,
        totalStaff: b.totalStaff,
        totalCheckinsToday: b.totalCheckinsToday,

        images: b.images || [],

        image:
          b.images &&
            b.images.length > 0 &&
            b.images[0].startsWith("http")
            ? b.images[0]
            : "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"

      }))

      setBranches(mapped)

      const newTotalPages = Math.ceil(mapped.length / pageSize)

      if (page > newTotalPages) setPage(1)

    } catch (err) {

      console.error("Load branches failed:", err)

    }


  }

  useEffect(() => {
    loadBranches()
    loadStats()
  }, [])

  const stats = [
    {
      title: "Tổng Chi Nhánh",
      value: apiStats.totalBranches,
      icon: cilLocationPin,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },
    {
      title: "Đang Hoạt Động",
      value: apiStats.activeBranches,
      icon: cilChartLine,
      bg: "#DCFCE7",
      color: "#22C55E"
    },
    {
      title: "Chờ Phê Duyệt",
      value: apiStats.pendingBranches,
      icon: cilPeople,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },
    {
      title: "Ngừng Hoạt Động",
      value: apiStats.inactiveBranches,
      icon: cilPeople,
      bg: "#FEE2E2",
      color: "#EF4444"
    }
  ]

  const totalPages = Math.ceil(branches.length / pageSize)

  const start = (page - 1) * pageSize
  const currentBranches =
    branches.slice(start, start + pageSize)

  const handleViewDetail = async (branch) => {


    setShowDetailModal(true)

    try {

      const data = await getBranchById(branch.id)

      const mapped = {

        id: data.branchId,
        name: data.name,
        address: data.address,

        email: data.email,
        hotline: data.hotline,

        status: data.status?.toLowerCase(),

        images: data.images || [],

        image:
          data.images &&
            data.images.length > 0 &&
            data.images[0].startsWith("http")
            ? data.images[0]
            : "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",

        totalRooms: data.totalRooms,
        totalStaff: data.totalStaff,
        totalCheckinsToday: data.totalCheckinsToday,

        rooms: data.rooms || [],
        staffs: data.staffs || [],

        createdAt: data.createdAt
      }

      setSelectedBranch(mapped)

    } catch (err) {

      console.error("Load branch detail failed:", err)

    }


  }

  const handleUpdate = async (id, payload) => {
    try {
      await updateBranch(id, payload)
      // Do not update branches array locally, wait for Gym Owner approval
      setShowDetailModal(false)
      setSuccessMessage("Đã gửi yêu cầu cập nhật đến Gym Owner. Vui lòng chờ phê duyệt.")
      setShowSuccessModal(true)
    } catch (err) {
      console.error("Update branch failed:", err)
    }
  }

  const handleDelete = (branch) => {


    setDeletingBranch(branch)
    setShowDeleteModal(true)


  }

  const confirmDelete = async () => {
    if (!deletingBranch) return
    try {
      await deleteBranch(deletingBranch.id)
      // Do not delete from branches array locally, wait for Gym Owner approval
      setShowDeleteModal(false)
      setDeletingBranch(null)
      setSuccessMessage("Đã gửi yêu cầu xóa đến Gym Owner. Vui lòng chờ phê duyệt.")
      setShowSuccessModal(true)
    } catch (err) {
      console.error("Delete branch failed:", err)
    }
  }

  return (


    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            Quản Lý Chi Nhánh
          </h3>
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

      <StatsCards stats={stats} />

      <div className="mt-4">

        <BranchGrid
          branches={currentBranches}
          onViewDetail={handleViewDetail}
        />

      </div>

      <div className="mt-4 d-flex justify-content-end">

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />

      </div>

      <CreateBranchModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
      />

      <BranchDetailModal
        visible={showDetailModal}
        setVisible={setShowDetailModal}
        branch={selectedBranch}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <ConfirmDeleteModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onConfirm={confirmDelete}
        itemName={deletingBranch?.name}
      />

      <CModal visible={showSuccessModal} onClose={() => setShowSuccessModal(false)} alignment="center">
        <CModalHeader closeButton className="border-0 pb-0"></CModalHeader>
        <CModalBody className="text-center pt-0 pb-4">
          <div className="mb-3 text-success d-flex justify-content-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h5 className="mb-3">Gửi yêu cầu thành công</h5>
          <p className="text-muted">{successMessage}</p>
          <CButton color="success" onClick={() => setShowSuccessModal(false)} className="mt-2 text-white">
            Đóng
          </CButton>
        </CModalBody>
      </CModal>

    </div>


  )

}

export default BranchManagementPage
