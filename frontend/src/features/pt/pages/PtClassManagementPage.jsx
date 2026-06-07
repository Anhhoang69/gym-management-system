import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { getClasses } from "../../super-admin/services/classService"
import PtClassDetailModal from "../components/PtClassDetailModal"

const localizer = momentLocalizer(moment)

function PtClassManagementPage() {
    const [events, setEvents] = useState([])
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState('month')

    const loadClasses = async () => {
        try {
            // Because the backend filters based on role, we just call getClasses() without passing trainerId unless required.
            // But just in case, if the API requires role-based filtering from token, it will be handled by the backend.
            const data = await getClasses()
            const mappedEvents = data.map(cls => {
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
            console.error("Failed to load PT classes", err)
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
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h3 className="fw-bold mb-1">Quản Lý Lớp Học Của Tôi</h3>
                    <p className="text-muted mb-0">Xem lịch, điểm danh và ghi chú học viên</p>
                </div>
            </div>

            <div className="flex-grow-1 bg-white p-3 rounded-3 shadow-sm border border-light">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    view={currentView}
                    onView={(view) => setCurrentView(view)}
                    onSelectEvent={handleSelectEvent}
                    messages={{
                        today: 'Hôm nay',
                        previous: 'Trước',
                        next: 'Tiếp',
                        month: 'Tháng',
                        week: 'Tuần',
                        day: 'Ngày',
                        agenda: 'Lịch trình'
                    }}
                    eventPropGetter={(event) => {
                        let backgroundColor = '#3B82F6'
                        if (event.resource.status === 'Completed') backgroundColor = '#10B981'
                        if (event.resource.status === 'Cancelled') backgroundColor = '#EF4444'
                        if (event.resource.isFull) backgroundColor = '#F59E0B'
                        return { style: { backgroundColor, border: 'none', borderRadius: '4px' } }
                    }}
                />
            </div>

            {selectedEvent && (
                <PtClassDetailModal
                    visible={showDetailModal}
                    setVisible={setShowDetailModal}
                    classData={selectedEvent}
                    onRefresh={loadClasses}
                />
            )}
        </div>
    )
}

export default PtClassManagementPage
