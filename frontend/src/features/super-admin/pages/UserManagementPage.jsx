import { useState, useEffect } from "react"

import StatsCards from "../components/common/StatsCards"
import UserFilters from "../components/user-management/UserFilters"
import UsersTable from "../components/user-management/UsersTable"
import CreateUserModal from "../components/user-management/CreateUserModal"
import EditUserModal from "../components/user-management/EditUserModal"
import Pagination from "../components/common/Pagination"

import { getBranches } from "../services/branchService"

import {
  getUsers,
  getUserStats,
  getUserById,
  updateUser,
  updateUserStatus
} from "../services/userService"

import {
  cilPeople,
  cilCheckCircle,
  cilUserFollow,
  cilUserPlus
} from "@coreui/icons"

function UserManagementPage() {

  // ================= STATE =================
  const [users, setUsers] = useState([])
  const [branches, setBranches] = useState([])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [branch, setBranch] = useState("")
  const [status, setStatus] = useState("")

  const [selectedIds, setSelectedIds] = useState([])

  const [page, setPage] = useState(1)
  const pageSize = 10

  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    staffAccounts: 0,
    memberAccounts: 0,
  })

  // ================= STATS =================
  const stats = [
    {
      title: "Tổng Người Dùng",
      value: statsData.totalUsers,
      icon: cilPeople,
      bg: "#FFF3CD",
      color: "#F59E0B",
    },
    {
      title: "Người Dùng Hoạt Động",
      value: statsData.activeUsers,
      icon: cilCheckCircle,
      bg: "#DCFCE7",
      color: "#22C55E",
    },
    {
      title: "Tài Khoản Staff",
      value: statsData.staffAccounts,
      icon: cilUserFollow,
      bg: "#E0F2FE",
      color: "#0284C7",
    },
    {
      title: "Thành Viên",
      value: statsData.memberAccounts,
      icon: cilUserPlus,
      bg: "#FEE2E2",
      color: "#EF4444",
    },
  ]

  // ================= LOAD USERS =================
  const loadUsers = async () => {
    try {
      const data = await getUsers(
        page,
        pageSize,
        search,
        role,
        branch,
        status
      )

      setUsers(data?.items || [])
      setTotalItems(data?.totalItems || 0)
      setTotalPages(data?.totalPages || 1)

    } catch (err) {
      console.error("Load users failed:", err)
    }
  }

  // ================= LOAD STATS =================
  const loadStats = async () => {
    try {
      const data = await getUserStats()
      setStatsData(data)
    } catch (err) {
      console.error("Load stats failed:", err)
    }
  }

  // ================= LOAD BRANCH =================
  const loadBranches = async () => {
    try {
      const res = await getBranches("", "")
      setBranches(res.items || res)
    } catch (e) {
      console.error("Load branches failed:", e)
    }
  }

  // ================= EFFECT =================

  useEffect(() => {
    loadUsers()
  }, [page])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      loadUsers()
    }, 300)

    return () => clearTimeout(timeout)
  }, [search, role, branch, status])

  useEffect(() => {
    loadStats()
    loadBranches()
  }, [])

  // ================= ACTION =================

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? users.map(u => u.userId) : [])
  }

  const clearSelection = () => setSelectedIds([])

  const handleEditUser = async (userId) => {
    const data = await getUserById(userId)
    setEditingUser(data)
    setShowEditModal(true)
  }

  const handleUpdateUser = async (updatedData) => {
    await updateUser(editingUser.userId, updatedData)

    setShowEditModal(false)
    setEditingUser(null)

    await loadUsers()
    await loadStats()
  }

  const handleDeleteUser = (user) => {
    setUsers(prev => prev.filter(u => u.userId !== user.userId))
  }

  const handleSuspendUser = async (userId) => {
    await updateUserStatus(userId, "Suspended")
    await loadUsers()
  }

  const onBulkSuspend = async () => {
    await Promise.all(
      selectedIds.map(id =>
        updateUserStatus(id, "Suspended")
      )
    )

    clearSelection()
    await loadUsers()
  }

  const onBulkEmail = () => {
    alert("Chưa implement gửi email")
  }

  // ================= UI =================

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 130px)", overflow: "hidden" }}>

      <div className="flex-shrink-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0">Quản Lý Người Dùng</h3>

          <button
            className="btn btn-warning px-4 fw-semibold"
            onClick={() => setShowCreateModal(true)}
          >
            + Tạo Người Dùng Mới
          </button>
        </div>

        <StatsCards stats={stats} />

        <div className="mt-3">
          <UserFilters
            search={search}
            setSearch={setSearch}
            role={role}
            setRole={setRole}
            branch={branch}
            setBranch={setBranch}
            status={status}
            setStatus={setStatus}
            branches={branches} // 🔥 FIX QUAN TRỌNG
            selectedCount={selectedIds.length}
            onBulkEmail={onBulkEmail}
            onBulkSuspend={onBulkSuspend}
            onClearSelection={clearSelection}
          />
        </div>
      </div>

      <div className="flex-grow-1 mt-3" style={{
        overflowY: "auto",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      }}>
        <UsersTable
          users={users}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={(u) => handleEditUser(u.userId)}
          onSuspend={handleSuspendUser}
          onDelete={handleDeleteUser}
        />
      </div>

      <div className="flex-shrink-0 d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Hiển thị {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, totalItems)} của {totalItems}
        </small>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>

      <CreateUserModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
        onCreated={loadUsers}
        branches={branches} 
      />

      <EditUserModal
        visible={showEditModal}
        setVisible={setShowEditModal}
        user={editingUser}
        onUpdate={handleUpdateUser}
      />

    </div>
  )
}

export default UserManagementPage