import { useState, useEffect } from "react"

import StatsCards from "../components/common/StatsCards"
import PackageFilters from "../components/package-management/PackageFilters"
import PackageGrid from "../components/package-management/PackageGrid"
import PackageForm from "../components/package-management/PackageForm"
import Pagination from "../components/common/Pagination"
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal"

import {
  getPackages,
  getPackageStats,
  getPackageById,
  updatePackage,
  createPackage,
  deletePackage,
  updatePackageStatus
} from "../services/packageService"

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from "@coreui/react"

import {
  cilLayers,
  cilCheckCircle,
  cilDollar,
  cilChartLine
} from "@coreui/icons"

function PackageManagementPage() {

  const [packages, setPackages] = useState([])

  const [statsData, setStatsData] = useState({
    totalPackages: 0,
    activePackages: 0,
    inactivePackages: 0,
    totalSubscribers: 0
  })

  const [showForm, setShowForm] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingPackage, setDeletingPackage] = useState(null)

  const [page, setPage] = useState(1)
  const pageSize = 4

  const loadPackages = async () => {


    try {

      const data = await getPackages()

      const mapped = data.map(p => ({

        id: p.packageId,

        name: p.name,
        description: p.description,

        tier: p.tier,
        status: p.status?.toLowerCase(),

        maxCheckinsPerWeek: p.maxCheckinsPerWeek,
        isPtIncluded: p.isPtIncluded,

        features: p.features || [],
        pricings: p.pricings || [],

        totalSubscribers: p.totalSubscribers,

        thumbnail: p.thumbnailUrl

      }))

      setPackages(mapped)

    } catch (err) {

      console.error("Load packages failed:", err)

    }


  }

  const loadStats = async () => {


    try {

      const data = await getPackageStats()

      setStatsData(data)

    } catch (err) {

      console.error("Load package stats failed:", err)

    }


  }

  useEffect(() => {


    loadPackages()
    loadStats()


  }, [])

  const totalPages = Math.ceil(packages.length / pageSize)

  const start = (page - 1) * pageSize

  const currentPackages =
    packages.slice(start, start + pageSize)

  const handleCreate = () => {


    setEditingPackage(null)
    setShowForm(true)


  }

  const handleEdit = async (pkg) => {

    try {

      const data = await getPackageById(pkg.id)

      const mapped = {

        id: data.packageId,

        name: data.name,
        description: data.description,

        tier: data.tier,
        status: data.status?.toLowerCase(),

        maxCheckinsPerWeek: data.maxCheckinsPerWeek,
        isPtIncluded: data.isPtIncluded,

        privatePtLimit: data.privatePtLimit,
        groupPtLimit: data.groupPtLimit,

        features: data.features || [],
        pricings: data.pricings || [],

        policy: data.policy || {},

        totalSubscribers: data.totalSubscribers

      }

      setEditingPackage(mapped)

      setShowForm(true)

    } catch (err) {

      console.error("Load package detail failed:", err)

    }

  }
  const handleSubmit = async (data) => {

    try {

      const payload = {

        name: data.name,
        description: data.description,

        thumbnailUrl: data.thumbnailUrl || "",

        tier: data.tier,
        isPtIncluded: data.isPtIncluded,

        privatePtLimit: data.privatePtLimit || 0,
        groupPtLimit: data.groupPtLimit || 0,

        maxCheckinsPerWeek: data.maxCheckinsPerWeek,

        badgeLabel: data.badgeLabel || "",

        displayOrder: data.displayOrder || 0,

        features: data.features || [],

        pricings: data.pricings || [],

        policy: data.policy

      }

      if (editingPackage) {
        await updatePackage(editingPackage.id, payload)
      } else {
        await createPackage(payload)
      }

      setShowForm(false)

      await loadPackages()

    } catch (err) {

      console.error("Update package failed:", err)

    }

  }

  const stats = [


    {
      title: "Tổng Số Gói",
      value: statsData.totalPackages,
      icon: cilLayers,
      bg: "#FFF3CD",
      color: "#F59E0B"
    },

    {
      title: "Gói Đang Hoạt Động",
      value: statsData.activePackages,
      icon: cilCheckCircle,
      bg: "#DCFCE7",
      color: "#22C55E"
    },

    {
      title: "Gói Ngừng Bán",
      value: statsData.inactivePackages,
      icon: cilDollar,
      bg: "#F3E8FF",
      color: "#A855F7"
    },

    {
      title: "Tổng Hội Viên",
      value: statsData.totalSubscribers,
      icon: cilChartLine,
      bg: "#FFEAD5",
      color: "#FB923C"
    }


  ]

  const handleDeleteClick = (pkg) => {

    setDeletingPackage(pkg)

    setShowDeleteModal(true)

  }

  const handleDelete = async () => {

    if (!deletingPackage) return

    try {

      await deletePackage(deletingPackage.id)

      setPackages(prev =>
        prev.filter(p => p.id !== deletingPackage.id)
      )

      setShowDeleteModal(false)
      setDeletingPackage(null)

      await loadStats()

    } catch (err) {

      console.error("Delete package failed:", err)

    }

  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "active" ? "Inactive" : "Active"

      await updatePackageStatus(id, newStatus)

      await loadPackages()
      await loadStats()
    } catch (err) {
      console.error("Update status failed:", err)
    }
  }

  return (
    <div className="d-flex flex-column h-100">
      {/* FIXED TOP AREA */}
      <div className="flex-shrink-0">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              Quản Lý Gói Tập
            </h3>
          </div>
          <button
            className="btn btn-warning px-4 fw-semibold shadow-sm"
            onClick={handleCreate}
          >
            + Tạo Gói Mới
          </button>
        </div>

        {/* STATS */}
        <StatsCards stats={stats} />
      </div>

      {/* SCROLLABLE GRID AREA */}
      <div className="flex-grow-1 overflow-auto pe-2 pb-4 mt-4">
        <PackageGrid
          packages={currentPackages}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />

        {/* PAGINATION */}
        <div className="mt-4 d-flex justify-content-end">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>

      {/* FORM MODAL */}
      <CModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        backdrop="static"
        keyboard={false}
        fullscreen
      >
        <CModalHeader className="bg-light">

          <CModalTitle>

            {editingPackage
              ? "Chỉnh Sửa Gói Tập"
              : "Tạo Gói Mới"}

          </CModalTitle>

        </CModalHeader>

        <CModalBody className="bg-light p-4" style={{ overflowY: 'auto' }}>
          <PackageForm
            formId="package-form"
            initialData={editingPackage || {}}
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        </CModalBody>
        <CModalFooter className="bg-white border-top">
            <CButton color="secondary" variant="ghost" className="px-4" onClick={() => setShowForm(false)}>
                Hủy bỏ
            </CButton>
            <CButton color="success" className="px-5 text-white fw-bold shadow-sm" type="submit" form="package-form">
                Lưu Gói Tập
            </CButton>
        </CModalFooter>
      </CModal>
      <ConfirmDeleteModal
        visible={showDeleteModal}
        setVisible={(v) => {
          setShowDeleteModal(v)
          if (!v) setDeletingPackage(null)
        }}
        onConfirm={handleDelete}
        itemName={deletingPackage?.name}
      />
    </div>



  )

}

export default PackageManagementPage
