import { useState, useEffect } from "react"
import {
  CToast,
  CToastBody,
  CToaster
} from "@coreui/react"

import RoomFilters from "../components/room-management/RoomFilters"
import RoomTable from "../components/room-management/RoomTable"
import Pagination from "../components/common/Pagination"
import CreateRoomModal from "../components/room-management/CreateRoomModal"
import EditRoomModal from "../components/room-management/EditRoomModal"
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal"

import { getBranches } from "../services/branchService"
import {
  getRooms,
  deleteRoom,
  updateRoomStatus
} from "../services/roomService"

function RoomManagementPage() {
  const [rooms, setRooms] = useState([])
  const [branches, setBranches] = useState([])

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [branchId, setBranchId] = useState("")

  const [page, setPage] = useState(1)
  const pageSize = 10
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingRoom, setDeletingRoom] = useState(null)
  
  const [toast, setToast] = useState(null)

  const loadBranches = async () => {
    try {
      const data = await getBranches()
      setBranches(data)
    } catch (err) {
      console.error("Load branches failed:", err)
    }
  }

  const loadRooms = async () => {
    try {
      const data = await getRooms(branchId, search, status)
      setRooms(data || [])
      
      const newTotalPages = Math.ceil((data?.length || 0) / pageSize)
      if (page > newTotalPages && newTotalPages > 0) setPage(1)
    } catch (err) {
      console.error("Load rooms failed:", err)
    }
  }

  useEffect(() => {
    loadBranches()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadRooms()
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, status, branchId])
  
  const totalPages = Math.max(1, Math.ceil(rooms.length / pageSize))
  const start = (page - 1) * pageSize
  const currentRooms = rooms.slice(start, start + pageSize)

  const showNotification = (message, color = "success") => {
    setToast(
      <CToast autohide delay={3000} color={color} className="text-white">
        <CToastBody>{message}</CToastBody>
      </CToast>
    )
  }

  const handleEdit = (room) => {
    setEditingRoom(room)
    setShowEditModal(true)
  }

  const handleDelete = (room) => {
    setDeletingRoom(room)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deletingRoom) return
    try {
      await deleteRoom(deletingRoom.roomId)
      setShowDeleteModal(false)
      setDeletingRoom(null)
      showNotification("Đã xoá phòng thành công")
      loadRooms()
    } catch (err) {
      console.error("Delete room failed:", err)
      showNotification(err.response?.data?.errors || "Lỗi khi xóa phòng", "danger")
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRoomStatus(id, newStatus)
      showNotification("Đã cập nhật trạng thái phòng")
      loadRooms()
    } catch (err) {
      console.error("Update status failed:", err)
      showNotification("Lỗi khi cập nhật trạng thái", "danger")
    }
  }

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 130px)", overflow: "hidden" }}>
      <div className="flex-shrink-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Quản Lý Phòng</h3>
            <p className="text-muted mb-0">
              Quản lý thông tin, thiết bị và bảo trì tất cả các phòng
            </p>
          </div>

          <button
            className="btn btn-warning px-4 fw-semibold"
            onClick={() => setShowCreateModal(true)}
          >
            + Thêm Phòng Mới
          </button>
        </div>

        <div>
          <RoomFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            branch={branchId}
            setBranch={setBranchId}
            branches={branches}
          />
        </div>
      </div>

      <div className="flex-grow-1 mt-3" style={{
        overflowY: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "white",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      }}>
        <RoomTable
          rooms={currentRooms}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      <div className="flex-shrink-0 d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Hiển thị {rooms.length === 0 ? 0 : (page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, rooms.length)} của {rooms.length}
        </small>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>

      <CreateRoomModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
        branches={branches}
        onCreated={() => {
          showNotification("Tạo phòng mới thành công")
          loadRooms()
        }}
      />

      <EditRoomModal
        visible={showEditModal}
        setVisible={setShowEditModal}
        room={editingRoom}
        onUpdated={() => {
          showNotification("Cập nhật phòng thành công")
          loadRooms()
        }}
      />

      <ConfirmDeleteModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        onConfirm={confirmDelete}
        itemName={deletingRoom?.name}
      />

      <CToaster placement="top-end">
        {toast}
      </CToaster>

    </div>
  )
}

export default RoomManagementPage
