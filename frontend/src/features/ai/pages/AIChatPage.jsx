import { useState, useEffect } from "react"
import AIChatPanel from "../components/AIChatPanel"
import StaffHeader from "../../staff/components/common/StaffHeader"
import StaffSidebar from "../../staff/components/common/StaffSidebar"
import PtHeader from "../../pt/components/common/PtHeader"
import PtSidebar from "../../pt/components/common/PtSidebar"
import AdminHeader from "../../super-admin/components/common/AdminHeader"
import Sidebar from "../../super-admin/components/common/Sidebar"
import BranchAdminSidebar from "../../branch-admin/components/common/BranchAdminSidebar"
import OwnerHeader from "../../gym-owner/components/common/OwnerHeader"
import OwnerSidebar from "../../gym-owner/components/common/OwnerSidebar"
import LandingHeader from "../../landing/components/LandingHeader"
import LandingFooter from "../../landing/components/LandingFooter"

/**
 * AIChatPageInner – Inner layout implementation.
 */
function AIChatPageInner() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [globalErrors, setGlobalErrors] = useState([])

  useEffect(() => {
    const handleError = (event) => {
      const msg = event.error ? event.error.stack || event.error.toString() : event.message
      setGlobalErrors((prev) => [...prev, `Error: ${msg}`])
    }
    const handleRejection = (event) => {
      const msg = event.reason ? (event.reason.stack || event.reason.toString()) : "Promise rejected"
      setGlobalErrors((prev) => [...prev, `Promise Rejection: ${msg}`])
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "var(--bg)" }}>
        <div style={{ color: "var(--text-secondary)" }}>Đang tải...</div>
      </div>
    )
  }

  const roles = (user?.roles || []).map((r) => r.toLowerCase())
  const hasRole = (r) => roles.includes(r.toLowerCase()) || roles.includes(`role_${r.toLowerCase()}`)

  // 1. SuperAdmin Layout
  if (hasRole("superadmin") || hasRole("admin")) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
        <AdminHeader />
        <div style={{ flex: 1, display: "flex" }}>
          <Sidebar />
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <AIChatPanel headerHeight={70} />
          </div>
        </div>
      </div>
    )
  }

  // 2. Gym Owner Layout
  if (hasRole("gymowner") || hasRole("owner")) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
        <OwnerHeader />
        <div style={{ flex: 1, display: "flex" }}>
          <OwnerSidebar />
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <AIChatPanel headerHeight={70} />
          </div>
        </div>
      </div>
    )
  }

  // 3. Branch Admin Layout
  if (hasRole("branchadmin")) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
        <AdminHeader />
        <div style={{ flex: 1, display: "flex" }}>
          <BranchAdminSidebar />
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <AIChatPanel headerHeight={70} />
          </div>
        </div>
      </div>
    )
  }

  // 4. PT Layout
  if (hasRole("pt") || hasRole("trainer")) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
        <PtHeader />
        <div style={{ flex: 1, display: "flex" }}>
          <PtSidebar />
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <AIChatPanel headerHeight={70} />
          </div>
        </div>
      </div>
    )
  }

  // 5. Staff Layout
  if (hasRole("staff") || hasRole("receptionist") || hasRole("sales")) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f5f6fa" }}>
        <StaffHeader />
        <div style={{ flex: 1, display: "flex" }}>
          <StaffSidebar />
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <AIChatPanel headerHeight={70} />
          </div>
        </div>
      </div>
    )
  }

  // 6. Member Layout / Visitor (Default landing page layout with header & footer)
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      {globalErrors.length > 0 && (
        <div style={{ position: "fixed", bottom: "10px", right: "10px", width: "450px", maxHeight: "350px", overflowY: "auto", background: "#fef2f2", border: "2px solid #ef4444", borderRadius: "8px", padding: "12px", zIndex: 99999, fontSize: "11px", fontFamily: "monospace", color: "#991b1b", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ fontWeight: "bold", borderBottom: "1px solid #fee2e2", paddingBottom: "5px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚠️ Debug Async Errors Logged:</span>
            <button onClick={() => setGlobalErrors([])} style={{ border: "none", background: "#fecaca", color: "#991b1b", cursor: "pointer", padding: "2px 8px", borderRadius: "4px" }}>Clear</button>
          </div>
          {globalErrors.map((err, idx) => (
            <div key={idx} style={{ borderBottom: "1px dashed #fee2e2", paddingBottom: "6px", marginBottom: "6px", whiteSpace: "pre-wrap" }}>{err}</div>
          ))}
        </div>
      )}
      <LandingHeader />
      <main className="flex-1 pt-[70px] overflow-hidden" style={{ height: "calc(100vh - 70px)" }}>
        <AIChatPanel headerHeight={70} />
      </main>
      <LandingFooter />
    </div>
  )
}

import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "30px", background: "#fef2f2", color: "#991b1b", minHeight: "100vh", fontFamily: "system-ui, monospace", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>⚠️ Hệ thống gặp lỗi giao diện (React Render Error)</h2>
          <p style={{ margin: 0, fontSize: "16px", color: "#b91c1c" }}>Lỗi này xảy ra do render runtime. Hãy chụp màn hình/copy log này gửi cho dev:</p>
          <div style={{ background: "#ffffff", border: "1px solid #fee2e2", borderRadius: "8px", padding: "15px", overflow: "auto" }}>
            <pre style={{ margin: 0, fontWeight: "bold", color: "#ef4444" }}>{this.state.error?.toString()}</pre>
            <pre style={{ margin: "10px 0 0 0", color: "#4b5563", fontSize: "12px", lineHeight: 1.5 }}>{this.state.error?.stack}</pre>
          </div>
          {this.state.errorInfo && (
            <div style={{ background: "#ffffff", border: "1px solid #fee2e2", borderRadius: "8px", padding: "15px", overflow: "auto" }}>
              <h4 style={{ margin: "0 0 5px 0", fontSize: "14px" }}>Component Stack Trace:</h4>
              <pre style={{ margin: 0, color: "#4b5563", fontSize: "12px", lineHeight: 1.5 }}>{this.state.errorInfo.componentStack}</pre>
            </div>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

export default function AIChatPage() {
  return (
    <ErrorBoundary>
      <AIChatPageInner />
    </ErrorBoundary>
  )
}
