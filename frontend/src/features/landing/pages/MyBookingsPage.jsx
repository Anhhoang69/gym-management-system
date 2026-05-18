import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/memberService';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie, FaTimes } from 'react-icons/fa';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (classId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đặt chỗ lớp này?")) return;
    try {
      await cancelBooking(classId, "Người dùng hủy");
      alert("Hủy đặt chỗ thành công!");
      fetchBookings();
    } catch (e) {
      alert("Lỗi khi hủy đặt chỗ.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[var(--text-secondary)]">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <FaCalendarAlt className="text-[var(--brand)]" />
        Lớp học của tôi
      </h2>

      {bookings.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 text-center text-[var(--text-secondary)]">
          Bạn chưa đặt chỗ lớp học nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm flex flex-col transition-transform hover:scale-[1.02]">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">{booking.className || "Lớp học"}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                    booking.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {booking.status === 'Cancelled' ? 'Đã hủy' : booking.status === 'Completed' ? 'Đã học' : 'Sắp tới'}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    <span>{booking.startTime ? new Date(booking.startTime).toLocaleString('vi-VN') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserTie className="text-gray-400" />
                    <span>PT: {booking.trainerName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>Phòng: {booking.roomName || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                <div className="p-3 border-t border-[var(--border)] bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                  <button 
                    onClick={() => handleCancelBooking(booking.classId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <FaTimes /> Hủy đặt chỗ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
