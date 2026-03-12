import { useState } from "react"

import StatsCards from "../components/StatsCards"
import PackageFilters from "../components/PackageFilters"
import PackageGrid from "../components/PackageGrid"
import PackageForm from "../components/PackageForm"
import Pagination from "../components/Pagination"

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody
} from "@coreui/react"

import {
  cilLayers,
  cilCheckCircle,
  cilDollar,
  cilChartLine
} from "@coreui/icons"

function PackageManagementPage() {

  const [showForm, setShowForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)

  const stats = [
    {
      title: "Tổng Số Gói",
      value: "4",
      change: "+8% so với tháng trước",
      icon: cilLayers,
      bg: "#FFF3CD",
      color: "#F59E0B",
      positive: true
    },
    {
      title: "Đăng Ký Hoạt Động",
      value: "2,173",
      change: "+12% so với tháng trước",
      icon: cilCheckCircle,
      bg: "#DCFCE7",
      color: "#22C55E",
      positive: true
    },
    {
      title: "Giá Trị Gói TB",
      value: "$477",
      change: "+5% so với tháng trước",
      icon: cilDollar,
      bg: "#F3E8FF",
      color: "#A855F7",
      positive: true
    },
    {
      title: "Doanh Thu Tháng Này",
      value: "$1036.6K",
      change: "+15% so với tháng trước",
      icon: cilChartLine,
      bg: "#FFEAD5",
      color: "#FB923C",
      positive: true
    }
  ]

  // MOCK DATA
  const packages = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Gói ${i + 1}`,
    duration: `${3 + i} tháng`,
    price: 199 + i * 50,
    popularity: 60 + i,
    members: 120 + i * 10,
    features: [
      "Sử dụng thiết bị gym",
      "Locker miễn phí",
      "Ứng dụng mobile"
    ]
  }))

  // PAGINATION
  const pageSize = 4
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(packages.length / pageSize)

  const start = (page - 1) * pageSize
  const currentPackages = packages.slice(start, start + pageSize)

  const handleCreate = () => {
    setEditingPackage(null)
    setShowForm(true)
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg)
    setShowForm(true)
  }

  const handleSubmit = (data) => {
    console.log("SAVE PACKAGE", data)
    setShowForm(false)
  }

  return (
    <div>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Quản Lý Gói Tập</h3>
          <p className="text-muted mb-0">
            Quản lý các gói tập và giá
          </p>
        </div>

        <button
          className="btn btn-warning px-4 fw-semibold"
          onClick={handleCreate}
        >
          + Tạo Gói Mới
        </button>

      </div>

      {/* STATS */}
      <StatsCards stats={stats} />

      {/* FILTERS */}
      <div className="mt-4">
        <PackageFilters />
      </div>

      {/* PACKAGE GRID */}
      <div className="mt-4">
        <PackageGrid
          packages={currentPackages}
          onEdit={handleEdit}
        />
      </div>

      {/* PAGINATION */}
      <div className="mt-4 d-flex justify-content-end">

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />

      </div>

      {/* CREATE / UPDATE FORM MODAL */}
      <CModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        size="xl"
      >

        <CModalHeader>
          <CModalTitle>
            {editingPackage ? "Chỉnh Sửa Gói Tập" : "Tạo Gói Mới"}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>

          <PackageForm
            initialData={editingPackage || {}}
            onSubmit={handleSubmit}
          />

        </CModalBody>

      </CModal>

    </div>
  )
}

export default PackageManagementPage