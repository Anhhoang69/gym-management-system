import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu
} from "@coreui/react"
import {
  FaBell,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from "react-icons/fa"
import {
  getNotifications,
  getUnreadNotificationsCount,
  readNotification,
  readAllNotifications,
  deleteNotification
} from "../services/notificationService"

function NotificationDropdown() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount()

    // Poll for unread count every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount()
      setUnreadCount(count || 0)
    } catch (e) {
      console.error("Error fetching unread count", e)
    }
  }

  const fetchNotifications = async (pageNum, append = false) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const res = await getNotifications({ page: pageNum, pageSize: 10 })
      if (res) {
        if (append) {
          setNotifications(prev => [...prev, ...res.items])
        } else {
          setNotifications(res.items || [])
        }
        setPage(res.page)
        setTotalPages(res.totalPages)
      }
    } catch (e) {
      console.error("Error fetching notifications", e)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = (e) => {
    e.stopPropagation()
    if (page < totalPages) {
      fetchNotifications(page + 1, true)
    }
  }

  const handleMarkAllRead = async (e) => {
    e.stopPropagation()
    try {
      await readAllNotifications()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (e) {
      console.error("Error marking all read", e)
    }
  }

  const handleItemClick = async (n) => {
    if (!n.isRead) {
      try {
        await readNotification(n.notificationId)
        setNotifications(prev =>
          prev.map(item =>
            item.notificationId === n.notificationId
              ? { ...item, isRead: true }
              : item
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (e) {
        console.error("Error reading notification", e)
      }
    }

    if (n.actionUrl) {
      navigate(n.actionUrl)
    }
  }

  const handleDeleteItem = async (e, notificationId) => {
    e.stopPropagation()
    try {
      await deleteNotification(notificationId)
      
      const itemToDelete = notifications.find(n => n.notificationId === notificationId)
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId))
      
      if (itemToDelete && !itemToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (e) {
      console.error("Error deleting notification", e)
    }
  }

  const getNotifIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "success":
        return <FaCheckCircle className="text-success" size={16} />
      case "warning":
        return <FaExclamationTriangle className="text-warning" size={16} />
      case "error":
      case "danger":
        return <FaTimesCircle className="text-danger" size={16} />
      case "info":
      default:
        return <FaInfoCircle className="text-info" size={16} />
    }
  }

  const getNotifTime = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 6000)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  return (
    <CDropdown
      onVisibleChange={(isOpen) => {
        if (isOpen) {
          fetchNotifications(1, false)
        }
      }}
      alignment="end"
      popper={false}
    >
      <CDropdownToggle
        caret={false}
        className="position-relative bg-transparent border-0 p-0 d-flex align-items-center justify-content-center"
        style={{ width: 40, height: 40, cursor: "pointer" }}
      >
        <FaBell size={18} className="text-secondary" />
        {unreadCount > 0 && (
          <span
            className="position-absolute badge rounded-pill bg-danger"
            style={{
              top: "4px",
              right: "4px",
              fontSize: "0.6rem",
              padding: "0.25em 0.45em",
              zIndex: 10
            }}
          >
            {unreadCount}
          </span>
        )}
      </CDropdownToggle>

      <CDropdownMenu
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          marginTop: "12px",
          width: 320,
          maxHeight: 450,
          borderRadius: "0px", // sharp corners
          padding: 0,
          border: "1px solid var(--border, #e5e7eb)",
          borderTop: "0px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          backgroundColor: "var(--bg-secondary, #f5f5f5)",
          zIndex: 1050
        }}
        className="p-0 shadow-lg dropdown-menu-end"
      >
        <div style={{ display: "flex", flexDirection: "column", maxHeight: 450 }}>
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between p-3 border-bottom"
            style={{ borderColor: "var(--border, #e5e7eb)" }}
          >
            <span
              className="fw-bold"
              style={{ color: "var(--text-primary, #1b1b1b)", fontSize: "0.875rem" }}
            >
              Thông báo
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="btn btn-link p-0 text-decoration-none fw-semibold"
                style={{ fontSize: "0.75rem", color: "var(--brand, #ffc107)" }}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* Scrollable List */}
          <div
            style={{
              overflowY: "auto",
              maxHeight: 320,
              flex: 1,
              backgroundColor: "var(--bg-secondary, #f5f5f5)"
            }}
            className="custom-scrollbar"
          >
            {loading ? (
              <div className="text-center py-4 text-muted small">Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                Chưa có thông báo nào
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.notificationId}
                  className="d-flex flex-column p-3 border-bottom"
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    borderColor: "var(--border, #e5e7eb)",
                    backgroundColor: n.isRead ? "transparent" : "rgba(255, 193, 7, 0.05)"
                  }}
                  onClick={() => handleItemClick(n)}
                >
                  {/* Content */}
                  <div className="w-100">
                    <div
                      className="fw-semibold text-break"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-primary, #1b1b1b)",
                        lineHeight: "1.2"
                      }}
                    >
                      {n.title}
                    </div>
                    <div
                      className="text-break mt-1"
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-secondary, #4b5563)",
                        lineHeight: "1.3"
                      }}
                    >
                      {n.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Footer */}
          {page < totalPages && (
            <div
              className="text-center p-2 border-top bg-transparent d-flex justify-content-center align-items-center"
              style={{ borderColor: "var(--border, #e5e7eb)" }}
            >
              <button
                onClick={handleLoadMore}
                className="btn btn-sm btn-link text-decoration-none text-secondary fw-semibold w-100"
                style={{ fontSize: "0.75rem" }}
                disabled={loadingMore}
              >
                {loadingMore ? "Đang tải..." : "Xem thêm"}
              </button>
            </div>
          )}
        </div>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default NotificationDropdown
