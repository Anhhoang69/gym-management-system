import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

import { getClasses } from "../../super-admin/services/classService"
import { getMyBookings, cancelBooking } from "../services/memberService"
import ClassBookingModal from "../components/ClassBookingModal"

// Setup moment localizer
const localizer = momentLocalizer(moment)

export default function ClassSchedulePage() {
  const [events, setEvents] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('week')
  const [loading, setLoading] = useState(true)

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

  const loadClasses = async () => {
    try {
      setLoading(true)
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
        .filter(b => b.status !== 'Cancelled')
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
      setLoading(false)
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

  const handleCancelBooking = async (booking) => {
    const cleanTitle = cleanClassTitle(booking.className || booking.title || 'này');
    if (window.confirm(`Bạn có chắc chắn muốn hủy đặt chỗ cho lớp học "${cleanTitle}"?`)) {
      try {
        setLoading(true)
        await cancelBooking(booking.classId, "Người dùng hủy từ Lớp học")
        await loadClasses()
      } catch (err) {
        console.error(err)
        alert(err.response?.data?.message || "Có lỗi xảy ra khi hủy đặt chỗ.")
      } finally {
        setLoading(false)
      }
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
                <p>Đang tải lịch học...</p>
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
                  today: 'Hôm nay',
                  previous: 'Trước',
                  next: 'Tiếp',
                  month: 'Tháng',
                  week: 'Tuần',
                  day: 'Ngày',
                  agenda: 'Lịch trình',
                  showMore: (total) => `+ Xem thêm (${total})`
                }}
                components={{
                  event: ({ event }) => (
                    <div className="flex items-center gap-1.5 h-full w-full overflow-hidden text-[10px] font-semibold leading-none py-0.5">
                      {event.isBooked && (
                        <span className="flex-shrink-0 inline-flex items-center gap-0.5 bg-amber-400 text-purple-950 font-extrabold rounded-md px-1 py-0.5 text-[8px] tracking-wide border border-amber-300 shadow-sm leading-none">
                          <FaCheckCircle size={8} /> ĐÃ ĐẶT
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
                <span className="w-3 h-3 rounded-full bg-purple-600 shadow-sm border border-yellow-400"></span> Đã đăng ký
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span> Còn chỗ
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></span> Đã đầy
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span> Đã kết thúc
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
              Lớp đã đăng ký
            </span>
            <span className="bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 rounded-full font-bold" style={{ fontSize: '9px' }}>
              {myBookings.filter(b => b.status !== 'Cancelled').length} lớp
            </span>
          </h3>

          <div className="flex-grow overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
            {!localStorage.getItem("token") ? (
              <div className="py-10 text-center text-[var(--text-secondary)]">
                <p className="text-xs">Vui lòng đăng nhập để xem các lớp đã đặt chỗ.</p>
              </div>
            ) : myBookings.filter(b => b.status !== 'Cancelled').length === 0 ? (
              <div className="py-10 text-center text-[var(--text-secondary)] flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[var(--hover)] flex items-center justify-center text-purple-500/60 mb-0.5">
                  <FaCalendarAlt size={16} />
                </div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">Chưa đăng ký lớp nào</p>
                <p className="text-[10px] max-w-[180px] mx-auto text-[var(--text-secondary)]">Chọn các lớp có sẵn trên lịch và click "Đặt chỗ ngay"!</p>
              </div>
            ) : (
              myBookings
                .filter(b => b.status !== 'Cancelled')
                .map((booking, index) => {
                  const isCompleted = booking.status === 'Completed';
                  return (
                    <div
                      key={booking.bookingId || booking.classId || index}
                      className="p-2.5 bg-[var(--bg-third)] border border-[var(--border)] rounded-xl flex flex-col justify-between hover:border-purple-500/30 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-1.5 mb-1.5">
                        <span className="font-bold text-[var(--text-primary)] line-clamp-2 leading-snug" style={{ fontSize: '11px' }}>
                          {cleanClassTitle(booking.className || booking.title || "Lớp học")}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold flex-shrink-0 ${isCompleted
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          }`}>
                          {isCompleted ? 'Đã học' : 'Sắp tới'}
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
                            <span>PT: {booking.trainerName}</span>
                          </div>
                        )}
                        {booking.roomName && (
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="opacity-80 flex-shrink-0" size={9} />
                            <span>Phòng: {booking.roomName} {booking.roomNumber ? `(${booking.roomNumber})` : ''}</span>
                          </div>
                        )}
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="w-full py-1 font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors duration-200 mt-0.5 flex items-center justify-center gap-1 cursor-pointer"
                          style={{ fontSize: '9px' }}
                        >
                          <FaTimes size={8} /> Hủy đặt chỗ
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
        onRefresh={loadClasses}
      />

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
