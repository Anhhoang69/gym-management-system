import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FaCalendarAlt } from 'react-icons/fa'

import { getClasses } from "../../super-admin/services/classService"
import ClassBookingModal from "../components/ClassBookingModal"

// Setup moment localizer
const localizer = momentLocalizer(moment)

export default function ClassSchedulePage() {
  const [events, setEvents] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState('week')
  const [loading, setLoading] = useState(true)

  const loadClasses = async () => {
    try {
      setLoading(true)
      const data = await getClasses()
      const mappedEvents = data.map(cls => {
        // Combine date and time
        const start = new Date(`${cls.date}T${cls.startTime}`)
        const end = new Date(`${cls.date}T${cls.endTime}`)
        return {
          id: cls.classId,
          title: `${cls.title} (${cls.classType})`,
          start,
          end,
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
    setSelectedEvent(event.resource)
    setShowDetailModal(true)
  }

  return (
    <div className="w-full px-4 md:px-8 py-6 flex flex-col bg-[var(--bg-third)] text-[var(--text-primary)]" style={{ height: "calc(100vh - 64px)" }}>
      
      <div className="flex-grow overflow-hidden flex flex-col">
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
            style={{ flexGrow: 1 }}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            view={currentView}
            onView={(view) => setCurrentView(view)}
            onSelectEvent={handleSelectEvent}
            selectable={false}
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
            eventPropGetter={(event) => {
              let backgroundColor = '#3B82F6' // default blue (available)
              if (event.resource.status === 'Completed') backgroundColor = '#10B981' // green
              else if (event.resource.status === 'Cancelled') backgroundColor = '#EF4444' // red
              else if (event.resource.isFull) backgroundColor = '#F59E0B' // yellow (full)

              return {
                style: {
                  backgroundColor,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  padding: '2px 6px',
                  color: '#ffffff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }
              }
            }}
          />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-center md:justify-end">
        {/* Legend */}
        <div className="flex gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-sm"></span> Còn chỗ
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-sm"></span> Đã đầy
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm"></span> Đã kết thúc
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
