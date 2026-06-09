import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie, FaTimes, FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaCommentAlt } from 'react-icons/fa'

import { getClasses } from "../../super-admin/services/classService"
import { getMyBookings, cancelBooking } from "../services/memberService"
import ClassBookingModal from "../components/ClassBookingModal"
import { useLanguage } from '../../../shared/contexts/LanguageContext';

// Setup moment localizer
const localizer = momentLocalizer(moment)

const scheduleTranslations = {
  vi: {
    loading: "Đang tải lịch học...",
    booked: "ĐÃ ĐẶT",
    legendRegistered: "Đã đăng ký",
    legendAvailable: "Còn chỗ",
    legendFull: "Đã đầy",
    legendEnded: "Đã kết thúc",
    sidebarTitle: "Lớp đã đăng ký",
    classesCount: "{count} lớp",
    loginPrompt: "Vui lòng đăng nhập để xem các lớp đã đặt chỗ.",
    noClasses: "Chưa đăng ký lớp nào",
    bookingTip: "Chọn các lớp có sẵn trên lịch và click \"Đặt chỗ ngay\"!",
    statusCompleted: "Đã học",
    statusUpcoming: "Sắp tới",
    ptLabel: "PT: ",
    roomLabel: "Phòng: ",
    cancelBookingBtn: "Hủy đặt chỗ",
    // Cancel Modal
    cancelTitle: "Hủy đặt chỗ lớp học",
    cancelSubtitle: "Bạn đang hủy đặt chỗ cho lớp {className}",
    cancelPrompt: "Xin vui lòng chọn hoặc nhập lý do để chúng tôi cải thiện chất lượng phục vụ tốt hơn:",
    charCount: "{count}/150 ký tự",
    backBtn: "Quay lại",
    confirmCancelBtn: "Xác nhận hủy",
    customReasonPlaceholder: "Nhập lý do khác của bạn ở đây...",
    // Reasons
    reasonBusy: "Bận lịch cá nhân",
    reasonHealth: "Lý do sức khỏe",
    reasonPlans: "Thay đổi kế hoạch",
    reasonCommute: "Thời tiết xấu/Di chuyển",
    // Success Modal
    successTitle: "Hủy đặt chỗ thành công!",
    successMsg: "Vị trí của bạn đã được giải phóng. Bạn có thể chọn và đăng ký lớp học khác bất kỳ lúc nào!",
    okBtn: "Đồng ý",
    // Calendar Toolbar Messages
    calToday: 'Hôm nay',
    calPrevious: 'Trước',
    calNext: 'Tiếp',
    calMonth: 'Tháng',
    calWeek: 'Tuần',
    calDay: 'Ngày',
    calAgenda: 'Lịch trình',
  },
  en: {
    loading: "Loading schedule...",
    booked: "BOOKED",
    legendRegistered: "Registered",
    legendAvailable: "Available",
    legendFull: "Full",
    legendEnded: "Completed",
    sidebarTitle: "Registered Classes",
    classesCount: "{count} classes",
    loginPrompt: "Please log in to view your booked classes.",
    noClasses: "No classes registered",
    bookingTip: "Select an available class on the calendar and click \"Book Now\"!",
    statusCompleted: "Completed",
    statusUpcoming: "Upcoming",
    ptLabel: "PT: ",
    roomLabel: "Room: ",
    cancelBookingBtn: "Cancel Booking",
    // Cancel Modal
    cancelTitle: "Cancel Class Booking",
    cancelSubtitle: "You are canceling your booking for {className}",
    cancelPrompt: "Please select or enter a reason to help us improve our service:",
    charCount: "{count}/150 characters",
    backBtn: "Back",
    confirmCancelBtn: "Confirm Cancel",
    customReasonPlaceholder: "Enter your custom reason here...",
    // Reasons
    reasonBusy: "Busy schedule",
    reasonHealth: "Health issues",
    reasonPlans: "Change of plans",
    reasonCommute: "Bad weather/Commute",
    // Success Modal
    successTitle: "Booking Canceled!",
    successMsg: "Your spot has been released. You can browse and book another class at any time!",
    okBtn: "Dismiss",
    // Calendar Toolbar Messages
    calToday: 'Today',
    calPrevious: 'Previous',
    calNext: 'Next',
    calMonth: 'Month',
    calWeek: 'Week',
    calDay: 'Day',
    calAgenda: 'Agenda',
  }
};

export default function ClassSchedulePage() {
  const { locale } = useLanguage();
  const tSched = (key, params = {}) => {
    let text = scheduleTranslations[locale]?.[key] || scheduleTranslations.vi[key] || key;
    Object.keys(params).forEach(pKey => {
      text = text.replace(`{${pKey}}`, params[pKey]);
    });
    return text;
  };

  const [events, setEvents] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('week')
  const [loading, setLoading] = useState(true)

  // Cancellation Modal States
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [targetBooking, setTargetBooking] = useState(null)
  const [cancelReason, setCancelReason] = useState(tSched('reasonBusy'))
  const [submittingCancel, setSubmittingCancel] = useState(false)

  const quickReasons = [
    tSched('reasonBusy'),
    tSched('reasonHealth'),
    tSched('reasonPlans'),
    tSched('reasonCommute')
  ]

  const cleanClassTitle = (title) => {
    if (!title) return "";
    return title
      .replace(/^✅\s*/, "")
      .replace(/^\[Đã Đăng Ký\]\s*/i, "")
      .replace(/^✅\s*\[Đã Đăng Ký\]\s*/i, "")
      .trim();
  };

  const formatBookingDateTime = (booking) => {
    if (!booking.startTime) return 'N/A';

    if (booking.date) {
      const cleanDate = booking.date.split('T')[0];
      const isTimeOnly = booking.startTime.includes(':') && !booking.startTime.includes('-');
      if (isTimeOnly) {
        const combined = new Date(`${cleanDate}T${booking.startTime}`);
        if (!isNaN(combined.getTime())) {
          return combined.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
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
      return dateObj.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    return booking.startTime;
  };

  const loadClasses = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const data = await getClasses()

      // Fetch bookings if user is logged in
      let bookingsData = [];
      const token = localStorage.getItem("token");
      if (token) {
        try {
          bookingsData = await getMyBookings();
        } catch (e) {
          console.error("Failed to load user bookings in schedule", e);
        }
      }
      setMyBookings(bookingsData || []);

      const bookedClassIds = (bookingsData || [])
        .filter(b => b.status !== 'Cancelled' && b.bookingStatus !== 'Cancelled')
        .map(b => b.classId);

      const mappedEvents = data.map(cls => {
        // Combine date and time
        const start = new Date(`${cls.date}T${cls.startTime}`)
        const end = new Date(`${cls.date}T${cls.endTime}`)
        const isBooked = bookedClassIds.includes(cls.classId);

        return {
          id: cls.classId,
          title: cleanClassTitle(cls.title),
          start,
          end,
          isBooked,
          resource: cls
        }
      })
      setEvents(mappedEvents)
    } catch (err) {
      console.error("Failed to load classes", err)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  const handleSelectEvent = (event) => {
    setSelectedEvent({
      ...event.resource,
      isBooked: event.isBooked
    })
    setShowDetailModal(true)
  }

  const handleCancelBooking = (booking) => {
    setTargetBooking(booking)
    setCancelReason(tSched('reasonBusy'))
    setIsCancelModalOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!targetBooking) return
    setSubmittingCancel(true)
    try {
      await cancelBooking(targetBooking.classId, cancelReason || "Người dùng hủy từ Lớp học")
      setIsCancelModalOpen(false)
      setIsSuccessModalOpen(true)
      await loadClasses(true)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Có lỗi xảy ra khi hủy đặt chỗ.")
    } finally {
      setSubmittingCancel(false)
    }
  }

  return (
    <div className="w-full px-4 md:px-8 py-6 bg-[var(--bg-third)] text-[var(--text-primary)] h-[calc(100vh-70px)] flex flex-col overflow-hidden">
      <div className="flex-grow flex flex-col lg:flex-row gap-6 overflow-hidden h-full">

        {/* Left Side: Calendar (takes up main space, equal height to sidebar) */}
        <div className="flex-grow flex flex-col bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm h-full overflow-hidden">
          <div className="flex-grow overflow-hidden flex flex-col h-full">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)]">
                <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--brand)] rounded-full animate-spin mb-4"></div>
                <p>{tSched('loading')}</p>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                view={currentView}
                onView={(view) => setCurrentView(view)}
                onSelectEvent={handleSelectEvent}
                selectable={false}
                min={new Date(0, 0, 0, 5, 0, 0)} // Start from 5:00 AM
                max={new Date(0, 0, 0, 23, 0, 0)} // End at 11:00 PM
                messages={{
                  today: tSched('calToday'),
                  previous: tSched('calPrevious'),
                  next: tSched('calNext'),
                  month: tSched('calMonth'),
                  week: tSched('calWeek'),
                  day: tSched('calDay'),
                  agenda: tSched('calAgenda'),
                  showMore: (total) => `+ ${locale === 'vi' ? 'Xem thêm' : 'Show more'} (${total})`
                }}
                components={{
                  event: ({ event }) => (
                    <div className="flex items-center gap-1.5 h-full w-full overflow-hidden text-[10px] font-semibold leading-none py-0.5">
                      {event.isBooked && (
                        <span className="flex-shrink-0 inline-flex items-center gap-0.5 bg-amber-400 text-purple-950 font-extrabold rounded-md px-1 py-0.5 text-[8px] tracking-wide border border-amber-300 shadow-sm leading-none">
                          <FaCheckCircle size={8} /> {tSched('booked')}
                        </span>
                      )}
                      <span className="truncate">{event.title}</span>
                    </div>
                  )
                }}

                eventPropGetter={(event) => {
                  let backgroundColor = '#3B82F6' // default blue (available)
                  let border = 'none'

                  if (event.isBooked) {
                    backgroundColor = '#8B5CF6' // Purple for booked
                    border = '2px solid #F59E0B' // Golden border
                  } else if (event.resource.status === 'Completed') {
                    backgroundColor = '#10B981' // green
                  } else if (event.resource.status === 'Cancelled') {
                    backgroundColor = '#EF4444' // red
                  } else if (event.resource.isFull) {
                    backgroundColor = '#F59E0B' // yellow (full)
                  }

                  return {
                    style: {
                      backgroundColor,
                      border,
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '500',
                      padding: '2px 4px',
                      color: '#ffffff',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }
                  }
                }}
              />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-center md:justify-end flex-shrink-0">
            {/* Legend */}
            <div className="flex gap-6 text-xs font-medium text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-600 shadow-sm border border-yellow-400"></span> {tSched('legendRegistered')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span> {tSched('legendAvailable')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></span> {tSched('legendFull')}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span> {tSched('legendEnded')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registered Classes Sidebar (equal height, compact design) */}
        <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-4 shadow-sm h-full overflow-hidden">
          <h3 className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2 text-[var(--text-primary)] flex-shrink-0" style={{ fontSize: '14px', fontWeight: 'bold' }}>
            <span className="flex items-center gap-1.5">
              <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center">
                <FaCalendarAlt size={12} />
              </span>
              {tSched('sidebarTitle')}
            </span>
            <span className="bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 rounded-full font-bold" style={{ fontSize: '9px' }}>
              {tSched('classesCount', { count: myBookings.filter(b => b.status !== 'Cancelled' && b.bookingStatus !== 'Cancelled').length })}
            </span>
          </h3>

          <div className="flex-grow overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
            {!localStorage.getItem("token") ? (
              <div className="py-10 text-center text-[var(--text-secondary)]">
                <p className="text-xs">{tSched('loginPrompt')}</p>
              </div>
            ) : myBookings.filter(b => b.status !== 'Cancelled' && b.bookingStatus !== 'Cancelled').length === 0 ? (
              <div className="py-10 text-center text-[var(--text-secondary)] flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[var(--hover)] flex items-center justify-center text-purple-500/60 mb-0.5">
                  <FaCalendarAlt size={16} />
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">{tSched('noClasses')}</p>
                <p className="text-[10px] max-w-[180px] mx-auto text-[var(--text-secondary)]">{tSched('bookingTip')}</p>
              </div>
            ) : (
              myBookings
                .filter(b => b.status !== 'Cancelled' && b.bookingStatus !== 'Cancelled')
                .map((booking, index) => {
                  const isCompleted = booking.status === 'Completed';
                  return (
                    <div
                      key={booking.bookingId || booking.classId || index}
                      className="p-2.5 bg-[var(--bg-third)] border border-[var(--border)] rounded-xl flex flex-col justify-between hover:border-purple-500/30 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-1.5 mb-1.5">
                        <span className="font-bold text-[var(--text-primary)] line-clamp-2 leading-snug" style={{ fontSize: '11px' }}>
                          {cleanClassTitle(booking.className || booking.title || (locale === 'vi' ? "Lớp học" : "Class"))}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold flex-shrink-0 ${isCompleted
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}>
                          {isCompleted ? tSched('statusCompleted') : tSched('statusUpcoming')}
                        </span>
                      </div>

                      <div className="space-y-0.5 text-[10px] text-[var(--text-secondary)] mb-2">
                        <div className="flex items-center gap-1">
                          <FaClock className="opacity-80 flex-shrink-0" size={9} />
                          <span>{formatBookingDateTime(booking)}</span>
                        </div>
                        {booking.trainerName && (
                          <div className="flex items-center gap-1">
                            <FaUserTie className="opacity-80 flex-shrink-0" size={9} />
                            <span>{tSched('ptLabel')}{booking.trainerName}</span>
                          </div>
                        )}
                        {booking.roomName && (
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="opacity-80 flex-shrink-0" size={9} />
                            <span>{locale === 'vi' ? 'Phòng' : 'Room'}: {booking.roomName} {booking.roomNumber ? `(${booking.roomNumber})` : ''}</span>
                          </div>
                        )}
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="w-full py-1 font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors duration-200 mt-0.5 flex items-center justify-center gap-1 cursor-pointer"
                          style={{ fontSize: '9px' }}
                        >
                          <FaTimes size={8} /> {tSched('cancelBookingBtn')}
                        </button>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>

      </div>

      <ClassBookingModal
        visible={showDetailModal}
        setVisible={setShowDetailModal}
        classData={selectedEvent}
        onRefresh={() => loadClasses(true)}
      />

      {/* 1. Custom Cancellation Reason Modal */}
      {isCancelModalOpen && targetBooking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-[var(--bg-secondary)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--border)] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Red-Gradient Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-5 text-white flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-xl text-white">
                <FaExclamationTriangle size={20} />
              </span>
              <div>
                <h3 className="font-bold text-base">{tSched('cancelTitle')}</h3>
                <p className="text-[10px] text-white/80 font-medium">{tSched('cancelSubtitle', { className: cleanClassTitle(targetBooking.className || targetBooking.title) })}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              <p className="text-xs text-[var(--text-secondary)] mb-4 font-medium leading-relaxed">
                {tSched('cancelPrompt')}
              </p>

              {/* Quick Select Suggestion Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickReasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setCancelReason(reason)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                      cancelReason === reason
                        ? 'bg-red-50 dark:bg-rose-950/20 text-rose-500 border-rose-200 dark:border-rose-900/40 shadow-sm'
                        : 'bg-[var(--bg-third)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--hover)]'
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
                  placeholder={tSched('customReasonPlaceholder')}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-[var(--border)] rounded-xl bg-[var(--bg-third)] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-[var(--text-primary)] transition-all resize-none h-20"
                  maxLength={150}
                />
                <div className="text-right text-[10px] text-gray-400 mt-1">
                  {tSched('charCount', { count: cancelReason.length })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  disabled={submittingCancel}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--hover)] transition-all cursor-pointer"
                >
                  {tSched('backBtn')}
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={submittingCancel}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 shadow-md shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {submittingCancel ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : tSched('confirmCancelBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Success Notification Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="bg-[var(--bg-secondary)] rounded-2xl shadow-2xl w-full max-w-xs text-center p-6 border border-[var(--border)] animate-scale-in flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pulsing Green Check Icon */}
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mb-4 shadow-inner relative">
              <span className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-75"></span>
              <FaCheckCircle size={28} className="relative z-10" />
            </div>

            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">{tSched('successTitle')}</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-5 px-2 leading-relaxed">
              {tSched('successMsg')}
            </p>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-2 rounded-xl text-xs font-bold text-black bg-yellow-500 hover:bg-yellow-600 shadow-md shadow-yellow-500/20 hover:shadow-lg transition-all cursor-pointer"
            >
              {tSched('okBtn')}
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* Hide start/end time label inside calendar events */
        .rbc-event-label {
          display: none !important;
        }

        /* Tailwind custom styles for react-big-calendar to match Theme */
        .rbc-calendar {
          font-family: inherit;
          color: var(--text-primary);
        }
        
        /* Toolbar Buttons */
        .rbc-btn-group button {
          color: var(--text-secondary);
          border-color: var(--border);
          background-color: var(--bg-third);
          transition: all 0.2s;
        }
        .rbc-btn-group button:hover {
          background-color: var(--hover);
        }
        .rbc-btn-group button.rbc-active {
          background-color: var(--brand);
          color: var(--on-brand);
          border-color: var(--brand);
          box-shadow: none;
        }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active:hover {
          opacity: 0.9;
        }
        
        /* Grid Colors & Borders */
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view,
        .rbc-month-row, .rbc-day-bg, .rbc-header,
        .rbc-time-content, .rbc-time-header, .rbc-time-header-content,
        .rbc-timeslot-group, .rbc-day-slot .rbc-time-slot {
          border-color: var(--border) !important;
        }

        /* Headers */
        .rbc-header {
          padding: 10px 0;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Today Highlight */
        .rbc-today {
          background-color: var(--hover) !important;
        }

        /* Out of Month Days */
        .rbc-off-range-bg {
          background-color: var(--bg);
        }

        /* Time indicators */
        .rbc-time-header.rbc-overflowing {
          border-right-color: var(--border);
        }
        .rbc-time-gutter .rbc-timeslot-group {
          color: var(--text-secondary);
        }

        /* Events */
        .rbc-event {
          transition: transform 0.1s;
        }
        .rbc-event:hover {
          transform: scale(1.02);
          z-index: 10;
        }
      `}</style>
    </div>
  )
}
