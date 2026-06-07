import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import BranchAdminSidebar from "../../features/branch-admin/components/common/BranchAdminSidebar"
import AdminHeader from "../../features/super-admin/components/common/AdminHeader"
import { getMyProfile } from "../../features/super-admin/services/profileService"

function BranchAdminLayout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileAndSetBranch = async () => {
      try {
        const stored = localStorage.getItem("user")
        if (!stored) {
          navigate("/login")
          return
        }

        const profile = await getMyProfile()
        if (profile) {
          const parsed = JSON.parse(stored)
          // Add branch info to the user details in localStorage
          parsed.branchId = profile.branchId
          parsed.branchName = profile.branchName
          localStorage.setItem("user", JSON.stringify(parsed))
        }
      } catch (err) {
        console.error("Failed to load Branch Admin profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndSetBranch()
  }, [navigate])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div>Đang tải thông tin chi nhánh...</div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* HEADER */}
      <AdminHeader />

      {/* MAIN AREA */}
      <div
        style={{
          flex: 1,
          display: "flex"
        }}
      >
        {/* SIDEBAR */}
        <BranchAdminSidebar />

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            padding: 25,
            overflow: "auto"
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default BranchAdminLayout
