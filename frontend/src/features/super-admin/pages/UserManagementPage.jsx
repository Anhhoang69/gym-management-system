import { useState, useMemo } from "react"

import StatsCards from "../components/StatsCards"
import UserFilters from "../components/UserFilters"
import UsersTable from "../components/UsersTable"
import CreateUserModal from "../components/CreateUserModal"
import EditUserModal from "../components/EditUserModal"
import Pagination from "../components/Pagination"

import {
  cilPeople,
  cilCheckCircle,
  cilClock,
  cilBan
} from "@coreui/icons"

const MOCK_USERS = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/40?img=1",
    email: "sarah@gympro.com",
    role: "Admin",
    branch: "Downtown",
    status: "active",
    lastLogin: "2 giờ trước",
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/40?img=2",
    email: "mike.chen@gympro.com",
    role: "Trainer",
    branch: "Westside",
    status: "active",
    lastLogin: "5 giờ trước",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://i.pravatar.cc/40?img=3",
    email: "emily.d@gympro.com",
    role: "Staff",
    branch: "Downtown",
    status: "pending",
    lastLogin: "1 ngày trước",
  },
  {
    id: 4,
    name: "David Martinez",
    avatar: "https://i.pravatar.cc/40?img=4",
    email: "david.m@gympro.com",
    role: "Member",
    branch: "Eastside",
    status: "active",
    lastLogin: "3 giờ trước",
  },
]

function UserManagementPage() {

  const [users, setUsers] = useState(MOCK_USERS)

  const [showCreateModal, setShowCreateModal] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)

  const [editingUser, setEditingUser] = useState(null)

  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [branch, setBranch] = useState("")

  const [selectedIds, setSelectedIds] = useState([])

  const [page, setPage] = useState(1)

  const pageSize = 5

  const stats = [
    {
      title: "Tổng Người Dùng",
      value: "2,847",
      change: "+12% so với tháng trước",
      icon: cilPeople,
      bg: "#FFF3CD",
      color: "#F59E0B",
      positive: true,
    },
    {
      title: "Người Dùng Hoạt Động",
      value: "2,634",
      change: "+6% so với tháng trước",
      icon: cilCheckCircle,
      bg: "#DCFCE7",
      color: "#22C55E",
      positive: true,
    },
    {
      title: "Chờ Xác Minh",
      value: "142",
      change: "Đang chờ xác minh",
      icon: cilClock,
      bg: "#FFEAD5",
      color: "#FB923C",
      positive: null,
    },
    {
      title: "Bị Tạm Ngưng",
      value: "71",
      change: "-3% so với tháng trước",
      icon: cilBan,
      bg: "#FEE2E2",
      color: "#EF4444",
      positive: false,
    },
  ]

  const filtered = useMemo(() => {
    return users.filter((u) => {

      const s = search.toLowerCase()

      const matchSearch =
        !s ||
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.role.toLowerCase().includes(s)

      const matchRole = !role || u.role === role

      const matchBranch = !branch || u.branch === branch

      return matchSearch && matchRole && matchBranch

    })
  }, [users, search, role, branch])

  const total = filtered.length

  const totalPages = Math.ceil(total / pageSize)

  const start = (page - 1) * pageSize

  const current = filtered.slice(start, start + pageSize)

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(current.map((u) => u.id))
    } else {
      setSelectedIds([])
    }
  }

  const clearSelection = () => setSelectedIds([])

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleUpdateUser = (updatedUser) => {

    setUsers((prev) =>
      prev.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      )
    )

  }

  const handleDeleteUser = (user) => {

    setUsers((prev) =>
      prev.filter((u) => u.id !== user.id)
    )

  }

  const handleSuspendUser = (user) => {

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: "suspended" }
          : u
      )
    )

  }

  const onBulkEmail = () => {

    console.log("Send email to:", selectedIds)

  }

  const onBulkSuspend = () => {

    setUsers((prev) =>
      prev.map((u) =>
        selectedIds.includes(u.id)
          ? { ...u, status: "suspended" }
          : u
      )
    )

    clearSelection()

  }

  return (
    <div>

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3 className="fw-bold mb-1">

            Quản Lý Người Dùng

          </h3>

          <p className="text-muted mb-0">

            Quản lý quản trị viên, nhân viên, huấn luyện viên và thành viên.

          </p>

        </div>

        <button
          className="btn btn-warning px-4 fw-semibold"
          onClick={() => setShowCreateModal(true)}
        >
          + Tạo Người Dùng Mới
        </button>

      </div>

      {/* Stats */}

      <StatsCards stats={stats} />

      {/* Filters */}

      <div className="mt-4">

        <UserFilters
          search={search}
          setSearch={setSearch}
          role={role}
          setRole={setRole}
          branch={branch}
          setBranch={setBranch}
          selectedCount={selectedIds.length}
          onBulkEmail={onBulkEmail}
          onBulkSuspend={onBulkSuspend}
          onClearSelection={clearSelection}
        />

      </div>

      {/* Table */}

      <div className="mt-3">

        <UsersTable
          users={current}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={handleEditUser}
          onSuspend={handleSuspendUser}
          onDelete={handleDeleteUser}
        />

      </div>

      {/* Pagination */}

      <div className="d-flex justify-content-between align-items-center mt-3">

        <small className="text-muted">

          Hiển thị {start + 1}–{Math.min(start + pageSize, total)} của {total} kết quả

        </small>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />

      </div>

      {/* Create */}

      <CreateUserModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
      />

      {/* Edit */}

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