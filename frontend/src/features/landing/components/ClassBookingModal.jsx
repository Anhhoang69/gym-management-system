import { useState, useEffect } from "react"
import { FaTimes, FaCalendarAlt, FaClock, FaUserTie, FaMapMarkerAlt, FaUsers, FaDumbbell, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import { bookClass } from "../../../features/super-admin/services/classService"
import { useLanguage } from "../../../shared/contexts/LanguageContext"

const bookingTranslations = {
  vi: {
    upcoming: "Sắp diễn ra",
    inProgress: "Đang diễn ra",
    completed: "Đã kết thúc",
    cancelled: "Đã hủy",
    noDescription: "Không có mô tả cho lớp học này.",
    dateLabel: "Ngày học",
    timeLabel: "Thời gian",
    trainerLabel: "Huấn luyện viên",
    notAssigned: "Chưa phân công",
    roomLabel: "Phòng tập",
    capacityLabel: "Sĩ số lớp học",
    alreadyRegistered: "Bạn đã đăng ký tham gia lớp học này.",
    bookingSuccess: "Đặt chỗ thành công! Bạn có thể xem lại trong mục Lớp đã đăng ký.",
    btnRegistered: "Đã Đăng Ký Lớp Học",
    btnFull: "Lớp Đã Kín Chỗ",
    btnEnded: "Lớp Đã Kết Thúc",
    btnCancelled: "Lớp Đã Bị Hủy",
    btnBookNow: "Đặt Chỗ Ngay",
    errorDefault: "Có lỗi xảy ra khi đặt chỗ. Vui lòng thử lại sau."
  },
  en: {
    upcoming: "Upcoming",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Canceled",
    noDescription: "No description available for this class.",
    dateLabel: "Date",
    timeLabel: "Time",
    trainerLabel: "Trainer",
    notAssigned: "Not assigned",
    roomLabel: "Room",
    capacityLabel: "Class Capacity",
    alreadyRegistered: "You have registered for this class.",
    bookingSuccess: "Booking successful! You can view it in your Registered list.",
    btnRegistered: "Registered",
    btnFull: "Class Full",
    btnEnded: "Class Ended",
    btnCancelled: "Class Canceled",
    btnBookNow: "Book Now",
    errorDefault: "An error occurred while booking. Please try again later."
  }
};

export default function ClassBookingModal({ visible, setVisible, classData, onRefresh }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { locale } = useLanguage()
  const tBook = (key) => bookingTranslations[locale]?.[key] || bookingTranslations.vi[key] || key;

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setError(null)
      setSuccess(false)
      setLoading(false)
    }
  }, [visible, classData])

  if (!visible || !classData) return null

  const handleBookClass = async () => {
    try {
      setLoading(true)
      setError(null)
      await bookClass(classData.classId)
      setSuccess(true)
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.response?.data?.errors || tBook('errorDefault'))
    } finally {
      setLoading(false)
    }
  }

  // Determine availability
  const isBooked = classData.isBooked || success
  const isFull = classData.isFull
  const isPast = new Date(`${classData.date}T${classData.endTime}`) < new Date()
  const isCancelled = classData.status === "Cancelled"
  
  const canBook = !isFull && !isPast && !isCancelled && !isBooked

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
          <button 
            onClick={() => setVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
          >
            <FaTimes size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-yellow-500 text-black px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
              {classData.classType}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              classData.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 
              classData.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 
              'bg-blue-500/20 text-blue-400'
            }`}>
              {classData.status === 'Scheduled' ? tBook('upcoming') : 
               classData.status === 'InProgress' ? tBook('inProgress') : 
               classData.status === 'Completed' ? tBook('completed') : tBook('cancelled')}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-1 leading-tight">
            {(() => {
              const title = classData.title || "";
              return title
                .replace(/^✅\s*/, "")
                .replace(/^\[Đã Đăng Ký\]\s*/i, "")
                .replace(/^✅\s*\[Đã Đăng Ký\]\s*/i, "")
                .trim();
            })()}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6 pb-4 border-b border-gray-100">
            {classData.description || tBook('noDescription')}
          </p>

          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-yellow-500"><FaCalendarAlt size={16} /></div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{tBook('dateLabel')}</div>
                <div className="text-sm font-semibold text-gray-800">{classData.date}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-yellow-500"><FaClock size={16} /></div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{tBook('timeLabel')}</div>
                <div className="text-sm font-semibold text-gray-800">
                  {classData.startTime?.substring(0,5)} - {classData.endTime?.substring(0,5)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-yellow-500"><FaUserTie size={16} /></div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{tBook('trainerLabel')}</div>
                <div className="text-sm font-semibold text-gray-800">{classData.trainerName || tBook('notAssigned')}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-yellow-500"><FaMapMarkerAlt size={16} /></div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{tBook('roomLabel')}</div>
                <div className="text-sm font-semibold text-gray-800">
                  {classData.roomName} {classData.roomNumber ? `(${classData.roomNumber})` : ''}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 col-span-2">
              <div className="mt-0.5 text-yellow-500"><FaUsers size={16} /></div>
              <div className="w-full">
                <div className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>{tBook('capacityLabel')}</span>
                  <span className="font-medium">
                    <span className={isFull ? 'text-red-500' : 'text-green-600'}>
                      {classData.bookedCount}
                    </span> / {classData.capacity}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} 
                    style={{ width: `${Math.min(100, (classData.bookedCount / classData.capacity) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
              <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {classData.isBooked && !success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-start gap-2">
              <FaCheckCircle className="mt-0.5 flex-shrink-0" />
              <span>{tBook('alreadyRegistered')}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-start gap-2">
              <FaCheckCircle className="mt-0.5 flex-shrink-0" />
              <span>{tBook('bookingSuccess')}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleBookClass}
            disabled={!canBook || loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all shadow-sm ${
              isBooked ? 'bg-green-100 text-green-700 cursor-not-allowed' :
              !canBook ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
              'bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-md'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isBooked ? (
              <><FaCheckCircle size={16} /> {tBook('btnRegistered')}</>
            ) : isFull ? (
              tBook('btnFull')
            ) : isPast ? (
              tBook('btnEnded')
            ) : isCancelled ? (
              tBook('btnCancelled')
            ) : (
              <><FaDumbbell size={16} /> {tBook('btnBookNow')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
