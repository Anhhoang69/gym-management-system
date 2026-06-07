import { useState, useEffect, useCallback } from "react"
import { CCard, CCardBody, CBadge, CButton, CFormInput, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from "@coreui/react"
import { FaUserPlus } from "react-icons/fa"
import MembershipOnboardingModal from "../../super-admin/components/common/MembershipOnboardingModal"
import UnifiedPaymentDrawer from "../../super-admin/components/common/UnifiedPaymentDrawer"
import { getUsers, getUserById } from "../../super-admin/services/userService"
import { updateCardStatus } from "../../super-admin/services/cardService"
import { getMyProfile } from "../services/profileService"
import Pagination from "../../super-admin/components/common/Pagination"

const statusColor = {
  Active: "success",
  Inactive: "secondary",
  Suspended: "danger",
}

function formatDate(date) {
  if (!date) return "-"
  return new Date(date).toLocaleString("vi-VN")
}

export default function StaffDashboardPage() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const pageSize = 10

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState({})

  const [search, setSearch] = useState("")
  const [staffBranchName, setStaffBranchName] = useState("")

  useEffect(() => {
    // API /me just used to display the branch name
    const fetchProfileAndBranch = async () => {
      try {
        const profile = await getMyProfile()
        if (profile && profile.branchName) {
          setStaffBranchName(profile.branchName)
        }
      } catch (err) {
        console.error("Failed to load staff profile:", err)
      }
    }
    fetchProfileAndBranch()
  }, [])

  useEffect(() => {
    loadMembers()
  }, [page])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      loadMembers()
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const loadMembers = async () => {
    setLoading(true)
    try {
      // Fetch users with role "Member", without branchId filter to show all
      const data = await getUsers(page, pageSize, search, "Member", "")
      setUsers(data?.items || [])
      setTotalItems(data?.totalItems || 0)
      setTotalPages(data?.totalPages || 1)
    } catch (err) {
      console.error("Failed to load members:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCard = async (userId, newStatus) => {
    try {
      const userDetail = await getUserById(userId)
      const accessCard = userDetail?.memberInfo?.accessCard
      
      if (!accessCard) {
        alert("Hội viên này chưa được cấp thẻ!")
        return
      }

      const reason = window.prompt(`Nhập lý do chuyển trạng thái thẻ thành ${newStatus} (tùy chọn):`, "")
      if (reason === null) return

      await updateCardStatus(accessCard.accessCardId || accessCard.id, newStatus, reason)
      alert("Cập nhật trạng thái thẻ thành công!")
    } catch (err) {
      console.error(err)
      alert("Cập nhật trạng thái thẻ thất bại: " + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold mb-1">Tổng Quan</h3>
          <p className="text-muted mb-0">
            Danh sách tất cả hội viên trên hệ thống (Bạn đang ở {staffBranchName ? <span className="fw-semibold text-primary">{staffBranchName}</span> : "chi nhánh hiện tại"})
          </p>
        </div>
        <CButton 
          color="primary" 
          className="d-flex align-items-center gap-2 fw-medium text-white shadow-sm"
          style={{ borderRadius: '8px' }}
          onClick={() => setShowOnboarding(true)}
        >
          <FaUserPlus />
          <span className="d-none d-md-inline">Khách vãng lai</span>
        </CButton>
      </div>

      <CCard className="shadow-sm border-0">
        <CCardBody>
          <div className="mb-3 d-flex gap-2" style={{ maxWidth: 300 }}>
            <CFormInput 
              placeholder="Tìm tên hoặc email hội viên..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted">Đang tải dữ liệu...</div>
          ) : (
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <table className="table table-hover align-middle mb-0">
                <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 2, boxShadow: "0 1px 0 #eee" }}>
                  <tr>
                    <th>Hội viên</th>
                    <th>Email</th>
                    <th>Chi nhánh</th>
                    <th>Trạng thái</th>
                    <th>Lần đăng nhập</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        Không có hội viên nào.
                      </td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.userId}>
                        <td className="fw-medium">{u.fullName || "-"}</td>
                        <td className="text-muted" style={{ fontSize: 14 }}>{u.email}</td>
                        <td>{u.branchName || "-"}</td>
                        <td>
                          <CBadge color={statusColor[u.status] || "secondary"}>
                            {u.status}
                          </CBadge>
                        </td>
                        <td style={{ fontSize: 14 }}>{formatDate(u.lastLoginAt)}</td>
                        <td>
                          <CDropdown alignment="end">
                            <CDropdownToggle color="light" size="sm" caret={false}>
                              ⋮
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem onClick={() => handleUpdateCard(u.userId, 'Active')}>
                                Mở khóa thẻ (Active)
                              </CDropdownItem>
                              <CDropdownItem onClick={() => handleUpdateCard(u.userId, 'Inactive')}>
                                Vô hiệu hóa thẻ (Inactive)
                              </CDropdownItem>
                              <CDropdownItem className="text-warning" onClick={() => handleUpdateCard(u.userId, 'Lost')}>
                                Báo mất thẻ (Lost)
                              </CDropdownItem>
                              <CDropdownItem className="text-danger" onClick={() => handleUpdateCard(u.userId, 'Disabled')}>
                                Khóa thẻ (Disabled)
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
              <small className="text-muted">
                Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} của {totalItems}
              </small>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* MODALS */}
      <MembershipOnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        mode="quick-register"
        onSuccess={(data) => {
          setShowOnboarding(false);
          setPaymentData(data);
          setShowPayment(true);
        }}
      />

      <UnifiedPaymentDrawer
        isOpen={showPayment}
        onClose={() => {
          setShowPayment(false)
          loadMembers()
        }}
        invoiceId={paymentData.invoiceId}
        contractId={paymentData.contractId}
        totalAmountDue={paymentData.totalAmountDue}
        invoiceCode={paymentData.invoiceCode}
      />
    </div>
  )
}
