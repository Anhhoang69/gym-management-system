import { useState, useEffect } from "react"

import StatsCards from "../components/StatsCards"
import BranchGrid from "../components/BranchGrid"
import Pagination from "../components/Pagination"
import CreateBranchModal from "../components/CreateBranchModal"
import BranchDetailModal from "../components/BranchDetailModal"
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"

import {
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch
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


  }, [])

  const stats = [


    {
      title: "Tổng Chi Nhánh",
      value: branches.length,
      icon: cilLocationPin,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },

    {
      title: "Tổng Nhân Viên",
      value: branches.reduce(
        (sum, b) => sum + (b.totalStaff || 0),
        0
      ),
      icon: cilPeople,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },

    {
      title: "Checkin Hôm Nay",
      value: branches.reduce(
        (sum, b) => sum + (b.totalCheckinsToday || 0),
        0
      ),
      icon: cilPeople,
      bg: "#DCFCE7",
      color: "#22C55E"
    },

    {
      title: "Tổng Phòng",
      value: branches.reduce(
        (sum, b) => sum + (b.totalRooms || 0),
        0
      ),
      icon: cilChartLine,
      bg: "#DBEAFE",
      color: "#3B82F6"
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

      setBranches(prev =>
        prev.map(b =>
          b.id === id
            ? { ...b, ...payload }
            : b
        )
      )

      setShowDetailModal(false)

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

      setBranches(prev =>
        prev.filter(b => b.id !== deletingBranch.id)
      )

      setShowDeleteModal(false)
      setDeletingBranch(null)

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

    </div>


  )

}

export default BranchManagementPage
