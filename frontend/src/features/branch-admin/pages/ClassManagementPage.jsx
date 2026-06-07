import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { getClasses } from "../../super-admin/services/classService"

import CreateClassModal from "../../super-admin/components/class-management/CreateClassModal"
import ClassDetailModal from "../../super-admin/components/class-management/ClassDetailModal"

// Setup moment localizer
const localizer = momentLocalizer(moment)

function ClassManagementPage() {
    const storedUser = localStorage.getItem("user")
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    const myBranchId = currentUser?.branchId || ""

    const [events, setEvents] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [selectedDateSlot, setSelectedDateSlot] = useState(null)

    const [currentDate, setCurrentDate] = useState(new Date())
    const [currentView, setCurrentView] = useState('month')

    const loadClasses = async () => {
        try {
            const data = await getClasses({ branchId: myBranchId })
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
        }
    }

    useEffect(() => {
        loadClasses()
    }, [])

    const handleSelectSlot = (slotInfo) => {
        setSelectedDateSlot(slotInfo)
        setShowCreateModal(true)
    }

    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource)
        setShowDetailModal(true)
    }

    return (
        <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h3 className="fw-bold mb-1">Quản Lý Lớp Học</h3>
                </div>
                <button 
                    className="btn btn-warning px-4 fw-semibold"
                    onClick={() => {
                        setSelectedDateSlot(null)
                        setShowCreateModal(true)
                    }}
                >
                    + Tạo Lớp Học Mới
                </button>
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
                    onSelectSlot={handleSelectSlot}
                    selectable={true}
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
                        let backgroundColor = '#3B82F6' // default blue
                        if (event.resource.status === 'Completed') backgroundColor = '#10B981'
                        if (event.resource.status === 'Cancelled') backgroundColor = '#EF4444'
                        if (event.resource.isFull) backgroundColor = '#F59E0B' // yellow if full
                        return { style: { backgroundColor, border: 'none', borderRadius: '4px' } }
                    }}
                />
            </div>

            <CreateClassModal 
                visible={showCreateModal} 
                setVisible={setShowCreateModal}
                selectedSlot={selectedDateSlot}
                onRefresh={loadClasses}
                fixedBranchId={myBranchId}
            />

            <ClassDetailModal
                visible={showDetailModal}
                setVisible={setShowDetailModal}
                classData={selectedEvent}
                onRefresh={loadClasses}
            />
        </div>
    )
}

export default ClassManagementPage
