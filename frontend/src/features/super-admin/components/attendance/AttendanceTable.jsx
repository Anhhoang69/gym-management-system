import {
  CCard,
  CCardBody,
  CPagination,
  CPaginationItem,
  CSpinner
} from "@coreui/react"
import { useMemo } from "react";

function AttendanceTable({ data = [], loading = false, currentPage = 1, onPageChange, itemsPerPage = 10 }) {

  const formatDateTime = (isoString) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  const calculateDuration = (checkinStr, checkoutStr) => {
    if (!checkinStr || !checkoutStr) return '--';
    const checkin = new Date(checkinStr);
    const checkout = new Date(checkoutStr);
    const diffMs = checkout - checkin;
    if (diffMs <= 0) return '--';
    
    const diffMins = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <CCard className="shadow-sm border-0">
      <CCardBody>
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <table className="table align-middle table-hover">
              <thead className="table-light">
                <tr>
                  <th>Hội viên</th>
                  <th>Chi nhánh</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Thời gian tập</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Không có dữ liệu điểm danh
                    </td>
                  </tr>
                ) : (
                  currentData.map(item => (
                    <tr key={item.attendanceId}>
                      <td className="fw-medium">{item.memberName || "Khách"}</td>
                      <td>{item.branchName || "--"}</td>
                      <td>{formatDateTime(item.checkinAt)}</td>
                      <td>{formatDateTime(item.checkoutAt)}</td>
                      <td>{calculateDuration(item.checkinAt, item.checkoutAt)}</td>

                      <td>
                        {item.checkoutAt ? (
                          <span className="badge bg-success">
                            Hoàn thành
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            Đang tập
                          </span>
                        )}
                      </td>

                      <td>
                        <button className="btn btn-light btn-sm">
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, data.length)} trong tổng số {data.length}
                </small>
                <CPagination className="mb-0">
                  <CPaginationItem 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                  >
                    ‹
                  </CPaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <CPaginationItem 
                      key={i + 1} 
                      active={currentPage === i + 1}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </CPaginationItem>
                  ))}

                  <CPaginationItem 
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                  >
                    ›
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default AttendanceTable