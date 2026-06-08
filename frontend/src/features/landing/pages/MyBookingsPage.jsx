import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/memberService';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie, FaTimes, FaCheckCircle, FaExclamationTriangle, FaCommentAlt } from 'react-icons/fa';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [targetBooking, setTargetBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("Bận lịch cá nhân");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data || []);
      setCurrentPage(1); // Reset page on fetch
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (booking) => {
    setTargetBooking(booking);
    setCancelReason("Bận lịch cá nhân");
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetBooking) return;
    setSubmitting(true);
    try {
      await cancelBooking(targetBooking.classId, cancelReason || "Người dùng hủy");
      setIsCancelModalOpen(false);
      setIsSuccessModalOpen(true);
      fetchBookings();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Có lỗi xảy ra khi hủy đặt chỗ.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatBookingDateTime = (booking) => {
    if (!booking.startTime) return 'N/A';
    
    if (booking.date) {
      const cleanDate = booking.date.split('T')[0];
      const isTimeOnly = booking.startTime.includes(':') && !booking.startTime.includes('-');
      if (isTimeOnly) {
        const combined = new Date(`${cleanDate}T${booking.startTime}`);
        if (!isNaN(combined.getTime())) {
          return combined.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      }
    }
    
    const dateObj = new Date(booking.startTime);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    return booking.startTime;
  };

  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const quickReasons = [
    "Bận lịch cá nhân",
    "Lý do sức khỏe",
    "Thay đổi kế hoạch",
    "Thời tiết xấu/Di chuyển"
  ];

  return (
    <div className="w-full px-4 md:px-8 py-5 flex flex-col bg-transparent text-[var(--text-primary)] relative" style={{ height: "calc(100vh - 70px)" }}>
      {/* Centered Header section */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center text-center mb-5">
        <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 mb-1.5 justify-center">
          <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
            <FaCalendarAlt size={16} />
          </span>
          Lớp học của tôi
        </h2>
        <div className="text-xs font-semibold text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-lg shadow-sm">
          Tổng số: <span className="text-yellow-500 font-bold">{bookings.length}</span> lớp đã đặt
        </div>
      </div>

      {/* Main content grid area */}
      <div className="flex-grow overflow-hidden flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {loading ? (
            <div className="h-48 flex flex-col items-center justify-center text-[var(--text-secondary)] gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm">
              <div className="w-8 h-8 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold">Đang tải lịch đặt chỗ...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center text-[var(--text-secondary)] shadow-sm flex flex-col items-center gap-2 max-w-lg mx-auto mt-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-1">
                <FaCalendarAlt size={24} />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Chưa có lớp học nào</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs">Bạn chưa đăng ký tham gia lớp học nào. Hãy truy cập Lịch tập để chọn lớp phù hợp!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
              {paginatedBookings.map((booking) => {
                const isCancelled = booking.bookingStatus === 'Cancelled' || booking.status === 'Cancelled';
                const isCompleted = booking.bookingStatus === 'Attended' || booking.status === 'Completed';
                
                return (
                  <div 
                    key={booking.id} 
                    className="bg-[var(--bg-third)] border border-[var(--border)] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden group"
                  >
                    {/* Card accent bar based on status */}
                    <div className={`h-1 w-full flex-shrink-0 ${
                      isCancelled ? 'bg-rose-500' : isCompleted ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}></div>

                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Top Header Row inside Card */}
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-yellow-500 transition-colors line-clamp-1 leading-snug">
                            {booking.className || "Lớp học"}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${
                            isCancelled ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' :
                            isCompleted ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' :
                            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              isCancelled ? 'bg-rose-500' : isCompleted ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}></span>
                            {isCancelled ? 'Đã hủy' : isCompleted ? 'Đã học' : 'Sắp tới'}
                          </span>
                        </div>

                        {/* Detail list with icons matched to Navbar/Theme colors */}
                        <div className="flex flex-col gap-2 text-xs text-[var(--text-secondary)]">
                          <div className="flex items-center gap-2">
                            <span className="text-[var(--text-secondary)] flex-shrink-0 opacity-80">
                              <FaClock size={12} />
                            </span>
                            <span className="font-medium text-[11px] leading-none text-[var(--text-primary)]">{formatBookingDateTime(booking)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[var(--text-secondary)] flex-shrink-0 opacity-80">
                              <FaUserTie size={12} />
                            </span>
                            <span className="font-semibold text-[11px] leading-none text-[var(--text-primary)]">PT: {booking.trainerName || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[var(--text-secondary)] flex-shrink-0 opacity-80">
                              <FaMapMarkerAlt size={12} />
                            </span>
                            <span className="font-medium text-[11px] leading-none text-[var(--text-primary)]">Phòng: {booking.roomName || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Footer Row inside Card */}
                      {!isCancelled && !isCompleted && (
                        <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-end">
                          <button 
                            onClick={() => openCancelModal(booking)}
                            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 dark:border-rose-500/35 rounded-lg transition-all duration-200 hover:border-rose-500/20"
                          >
                            <FaTimes size={8} /> Hủy đặt chỗ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between mt-3 pt-2 border-t border-[var(--border)] gap-2">
            <div className="text-xs text-[var(--text-secondary)] font-medium">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, bookings.length)} của {bookings.length} lớp học đã đặt
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                      isActive
                        ? 'bg-yellow-500 text-black shadow-sm shadow-yellow-500/25'
                        : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. Custom Cancellation Reason Modal                     */}
      {/* ======================================================== */}
      {isCancelModalOpen && targetBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-[var(--bg-third)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--border)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Red-Gradient Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-5 text-white flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-xl text-white">
                <FaExclamationTriangle size={20} />
              </span>
              <div>
                <h3 className="font-bold text-base">Hủy đặt chỗ lớp học</h3>
                <p className="text-[10px] text-white/80 font-medium">Bạn đang hủy đặt chỗ cho lớp {targetBooking.className}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <p className="text-xs text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                Xin vui lòng chọn hoặc nhập lý do để chúng tôi cải thiện chất lượng phục vụ tốt hơn:
              </p>

              {/* Quick Select Suggestion Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickReasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setCancelReason(reason)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                      cancelReason === reason
                        ? 'bg-red-50 dark:bg-rose-950/20 text-rose-500 border-rose-200 dark:border-rose-900/40 shadow-sm'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--hover)]'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {/* Main Custom Textarea */}
              <div className="relative mb-5">
                <span className="absolute top-3 left-3 text-gray-400">
                  <FaCommentAlt size={12} />
                </span>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do khác của bạn ở đây..."
                  className="w-full pl-8 pr-3 py-2 text-xs border border-[var(--border)] rounded-xl bg-[var(--bg-third)] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-[var(--text-primary)] transition-all resize-none h-20"
                  maxLength={150}
                />
                <div className="text-right text-[10px] text-gray-400 mt-1">
                  {cancelReason.length}/150 ký tự
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--hover)] transition-all"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                >
                  {submitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "Xác nhận hủy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. Success Notification Modal                            */}
      {/* ======================================================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-[var(--bg-third)] rounded-2xl shadow-2xl w-full max-w-xs text-center p-6 border border-[var(--border)] animate-scale-in flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pulsing Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mb-4 shadow-inner relative">
              <span className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-75"></span>
              <FaCheckCircle size={28} className="relative z-10" />
            </div>

            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">Hủy đặt chỗ thành công!</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-5 px-2 leading-relaxed">
              Vị trí của bạn đã được giải phóng. Bạn có thể chọn và đăng ký lớp học khác bất kỳ lúc nào!
            </p>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-2 rounded-xl text-xs font-bold text-black bg-yellow-500 hover:bg-yellow-600 shadow-md shadow-yellow-500/20 hover:shadow-lg transition-all"
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
