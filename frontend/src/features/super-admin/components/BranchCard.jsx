import { CBadge } from "@coreui/react"
import {
  cilHome,
  cilPeople,
  cilWalk,
  cilPhone
} from "@coreui/icons"
import CIcon from "@coreui/icons-react"

function BranchCard({ branch, onViewDetail }) {

  const statusColor =
    branch.status === "active"
      ? "success"
      : "secondary"

  const statusText =
    branch.status === "active"
      ? "Hoạt động"
      : "Ngừng hoạt động"

  const image =
    branch.image ||
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => onViewDetail(branch)}
    >
      {/* Image Section */}
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={image}
          alt={branch.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <CBadge color={statusColor} className="px-2 py-1 shadow-sm">
            {statusText}
          </CBadge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
        <div className="absolute bottom-3 left-4 right-4">
          <h5 className="text-white font-bold text-lg mb-0 truncate drop-shadow-md">{branch.name}</h5>
          <p className="text-gray-200 text-xs mb-0 truncate drop-shadow-md">{branch.address}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-center mb-4">
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 group-hover:bg-[var(--brand)]/5 transition-colors">
            <CIcon icon={cilHome} className="text-[var(--brand)] w-4 h-4 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Phòng</span>
            <span className="font-bold text-gray-800">{branch.totalRooms}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 group-hover:bg-info/5 transition-colors">
            <CIcon icon={cilPeople} className="text-info w-4 h-4 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Nhân viên</span>
            <span className="font-bold text-gray-800">{branch.totalStaff}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 group-hover:bg-success/5 transition-colors">
            <CIcon icon={cilWalk} className="text-success w-4 h-4 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Checkin HN</span>
            <span className="font-bold text-gray-800">{branch.totalCheckinsToday}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 group-hover:bg-secondary/5 transition-colors">
            <CIcon icon={cilPhone} className="text-secondary w-4 h-4 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Hotline</span>
            <span className="font-bold text-gray-800 text-xs truncate w-full">{branch.hotline || "-"}</span>
          </div>

        </div>

        <button
          className="w-full py-2 bg-gray-100 hover:bg-[var(--brand)] text-gray-700 hover:text-black rounded-lg text-sm font-semibold transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(branch);
          }}
        >
          Xem Chi Tiết
        </button>
      </div>
    </div>
  )
}

export default BranchCard