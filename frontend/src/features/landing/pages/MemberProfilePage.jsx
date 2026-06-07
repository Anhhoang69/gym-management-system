import { useState, useEffect, useRef } from "react"
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaCheckCircle, FaHistory, FaTicketAlt, FaKey, FaDesktop, FaTimes } from "react-icons/fa"
import { changePassword, send2FAOtp, enable2FA, disable2FA } from '../../auth/services/authService'
import { getMyProfile, updateMyProfile, getLoginHistory, revokeSession, getMyRequests, cancelRequest, getMyAttendance, uploadImage } from '../services/memberService'

export default function MemberProfilePage() {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [activeTab, setActiveTab] = useState('general'); // general, security, sessions, requests

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Member",
    avatarUrl: "https://i.pravatar.cc/150",
    joinDate: "N/A",
    gender: "Male",
    birthday: "",
    address: "",
    memberInfo: null
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [])

  useEffect(() => {
    if (activeTab === 'sessions') fetchSessions();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'attendance') fetchAttendance();
  }, [activeTab])

  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const data = await getMyAttendance();
      setAttendance(data || []);
      setCurrentPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAttendance(false);
    }
  }

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

  const updateLocalStorageUser = (updatedFields) => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const updated = { ...parsed, ...updatedFields }
        localStorage.setItem("user", JSON.stringify(updated))
        window.dispatchEvent(new Event("userProfileUpdated"))
      } catch (e) {
        console.error(e)
      }
    }
  }

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      if (data) {
        const profileData = {
          ...user,
          fullName: data.fullName || data.email?.split('@')[0],
          email: data.email,
          phone: data.phoneNumber || "",
          gender: data.gender || "Male",
          birthday: data.birthday ? data.birthday.split('T')[0] : "",
          address: data.address || "",
          role: "Member",
          avatarUrl: data.avatarUrl || "https://i.pravatar.cc/150",
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN') : "N/A",
          memberInfo: data.memberInfo || null
        };
        setUser(profileData);
        setIs2FAEnabled(data.twoFactorEnabled);
        
        // Sync with localStorage so header stays updated
        updateLocalStorageUser({
          fullName: profileData.fullName,
          avatarUrl: profileData.avatarUrl
        });
      }
    } catch (e) {
      // fallback to localStorage if API fails or not ready
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          setUser({
            ...user,
            ...parsed,
            fullName: parsed.email ? parsed.email.split('@')[0] : user.fullName,
            avatarUrl: parsed.avatarUrl || user.avatarUrl
          })
        } catch (err) { }
      }
    }
  }

  const fetchSessions = async () => {
    try {
      const data = await getLoginHistory();
      setSessions(data?.items || []);
    } catch (e) { }
  }

  const fetchRequests = async () => {
    try {
      const data = await getMyRequests();
      setRequests(data || []);
    } catch (e) { }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const uploadedUrl = await uploadImage(file)
      if (uploadedUrl) {
        setUser(prev => ({
          ...prev,
          avatarUrl: uploadedUrl
        }))

        await updateMyProfile({
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phone,
          gender: user.gender,
          birthday: user.birthday || null,
          address: user.address,
          avatarUrl: uploadedUrl
        })

        // Sync local storage & dispatch event to update header avatar
        updateLocalStorageUser({ avatarUrl: uploadedUrl })

        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 3000)
      }
    } catch (err) {
      console.error("Lỗi upload ảnh", err)
      const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Lỗi khi upload ảnh!"
      alert(`Lỗi khi upload ảnh: ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`)
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await updateMyProfile({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phone,
        gender: user.gender,
        birthday: user.birthday || null,
        address: user.address,
        avatarUrl: user.avatarUrl
      });

      // Sync local storage & dispatch event to update header name
      updateLocalStorageUser({ fullName: user.fullName })

      alert("Cập nhật thông tin thành công!")
    } catch (e) {
      alert("Lỗi khi cập nhật thông tin");
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!")
      return
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      alert("Đổi mật khẩu thành công!")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (e) {
      alert("Lỗi khi đổi mật khẩu");
    }
  }

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      // Disable 2FA
      if (!showOtpInput) {
        await send2FAOtp();
        setShowOtpInput(true);
        alert("Mã OTP đã được gửi. Vui lòng nhập để xác nhận TẮT 2FA.");
      } else {
        try {
          await disable2FA({ otpCode: otp });
          setIs2FAEnabled(false);
          setShowOtpInput(false);
          setOtp("");
          alert("Đã tắt 2FA.");
        } catch (e) { alert("OTP không hợp lệ."); }
      }
    } else {
      // Enable 2FA
      if (!showOtpInput) {
        await send2FAOtp();
        setShowOtpInput(true);
        alert("Mã OTP đã được gửi. Vui lòng nhập để xác nhận BẬT 2FA.");
      } else {
        try {
          await enable2FA({ otpCode: otp });
          setIs2FAEnabled(true);
          setShowOtpInput(false);
          setOtp("");
          alert("Đã bật 2FA.");
        } catch (e) { alert("OTP không hợp lệ."); }
      }
    }
  }

  const handleRevokeSession = async (id) => {
    try {
      await revokeSession(id);
      fetchSessions();
      alert("Đã thu hồi phiên đăng nhập.");
    } catch (e) { alert("Lỗi khi thu hồi phiên."); }
  }

  const handleCancelRequest = async (id) => {
    try {
      await cancelRequest(id);
      fetchRequests();
      alert("Đã hủy yêu cầu.");
    } catch (e) { alert("Lỗi khi hủy yêu cầu."); }
  }

  return (
    <div className="w-full px-4 md:px-8 py-4 flex flex-col" style={{ height: "calc(100vh - 70px)" }}>
      {/* Header section - compact */}
      <div className="mt-2 mb-2 flex-shrink-0 flex items-center justify-center w-full">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Hồ Sơ Cá Nhân</h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow overflow-hidden pb-2">

        {/* LEFT COLUMN: Avatar & Quick Info */}
        <div className="w-full lg:w-[350px] flex-shrink-0 h-full">
          <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden h-full flex flex-col">
            <div className="h-24 bg-gradient-to-r from-yellow-400 to-orange-400 flex-shrink-0"></div>
            <div className="px-5 pb-5 text-center relative flex-grow flex flex-col">
              <div className="relative inline-block -mt-12 mb-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
                <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white mx-auto">
                  <img
                    src={user.avatarUrl || "https://i.pravatar.cc/150"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-[calc(50%-48px)] bg-yellow-500 text-white p-1.5 rounded-full shadow-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  title="Thay đổi ảnh đại diện"
                >
                  <FaCamera size={12} />
                </button>
              </div>

              <h4 className="text-lg font-bold text-[var(--text-primary)] mb-0.5">{user.fullName || "User"}</h4>
              <p className="text-[var(--text-secondary)] text-sm mb-2">{user.email}</p>

              <div className="mb-auto">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                  {user.role}
                </span>
              </div>

              <div className="flex justify-between text-left border-t border-[var(--border)] pt-4 mt-4 w-full px-2">
                <div>
                  <div className="text-xs text-[var(--text-secondary)] mb-2">Tình trạng</div>
                  <div className="text-sm font-semibold text-green-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Đang hoạt động
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-secondary)] mb-2">Ngày tham gia</div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{user.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tabs and Forms */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto custom-scrollbar flex-shrink-0">
            <button onClick={() => setActiveTab('general')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'general' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Thông tin chung</button>
            <button onClick={() => setActiveTab('membership')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'membership' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Thẻ & Gói tập</button>
            <button onClick={() => setActiveTab('security')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'security' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Bảo mật</button>
            <button onClick={() => setActiveTab('sessions')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'sessions' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Phiên đăng nhập</button>
            <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'requests' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Yêu cầu của tôi</button>
            <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'attendance' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Lịch sử check-in</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

            {/* MEMBERSHIP TAB */}
            {activeTab === 'membership' && (
              <div className="flex flex-col xl:flex-row gap-6">
                {/* Gym Card representation */}
                <div className="flex-1 bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6 flex flex-col justify-between relative overflow-hidden min-h-[220px] max-w-[400px]">
                  {/* Card background/gradient decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
                  
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <h4 className="text-lg font-bold text-[var(--text-primary)] tracking-wide">EnerGym</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Thẻ Thành Viên / Member Card</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.memberInfo?.cardStatus === 'Active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/35 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-950/35 dark:text-red-400'
                    }`}>
                      {user.memberInfo?.cardStatus === 'Active' ? 'Đang hoạt động' : 'Khóa / Chưa có'}
                    </span>
                  </div>

                  <div className="mt-6 z-10 text-left">
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase">Mã thẻ / Card Code</div>
                    <div className="text-xl font-mono font-bold text-[var(--text-primary)] tracking-wider mt-0.5">
                      {user.memberInfo?.cardCode || 'Chưa cấp thẻ'}
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-6 z-10 text-left">
                    <div>
                      <div className="text-[9px] text-[var(--text-secondary)] uppercase">Chủ thẻ / Card Holder</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)] uppercase">{user.fullName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-[var(--text-secondary)] uppercase">Hạn dùng / Expires</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {user.memberInfo?.cardExpireDate ? new Date(user.memberInfo.cardExpireDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract details */}
                <div className="flex-[1.5] bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
                  <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-yellow-500" />
                    Hợp đồng gói tập hiện tại
                  </h5>
                  
                  {user.memberInfo?.activeContract ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">Gói tập</div>
                          <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                            Gói {user.memberInfo.activeContract.packageName}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">Trạng thái</div>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            user.memberInfo.activeContract.status === 'Active' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-950/35 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/35 dark:text-yellow-400'
                          }`}>
                            {user.memberInfo.activeContract.status === 'Active' ? 'Kích hoạt' : user.memberInfo.activeContract.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-3">
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">Ngày bắt đầu</div>
                          <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                            {new Date(user.memberInfo.activeContract.startDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">Ngày kết thúc</div>
                          <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                            {new Date(user.memberInfo.activeContract.endDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-3">
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">Buổi tập PT còn lại</div>
                          <div className="text-sm font-bold text-yellow-500 mt-0.5">
                            {user.memberInfo.activeContract.remainingPrivateSessions} buổi
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">Buổi tập nhóm còn lại</div>
                          <div className="text-sm font-bold text-yellow-500 mt-0.5">
                            {user.memberInfo.activeContract.remainingGroupSessions} buổi
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                      Bạn hiện không có hợp đồng gói tập nào đang kích hoạt.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4">
                <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <FaUser className="text-yellow-500" />
                  Cập nhật thông tin
                </h5>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Họ và tên</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Vai trò</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                        value={user.role}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                        <FaEnvelope className="text-gray-400" /> Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                        <FaPhone className="text-gray-400" /> Số điện thoại
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Giới tính</label>
                      <select
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.gender}
                        onChange={(e) => setUser({ ...user, gender: e.target.value })}
                      >
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ngày sinh</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.birthday}
                        onChange={(e) => setUser({ ...user, birthday: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                      value={user.address}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end mt-3">
                    <button type="submit" className="px-4 py-2 bg-[var(--brand)] hover:brightness-110 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5">
                      <FaCheckCircle /> Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="flex flex-col gap-4">
                <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4">
                  <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <FaLock className="text-red-500" />
                    Đổi mật khẩu
                  </h5>
                  <form onSubmit={handleUpdatePassword}>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                        placeholder="Nhập mật khẩu cũ..."
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                          placeholder="Nhập mật khẩu mới..."
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                          placeholder="Nhập lại mật khẩu mới..."
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5">
                        <FaKey /> Đổi mật khẩu
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4">
                  <h5 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <FaLock className="text-blue-500" />
                    Xác thực 2 bước (2FA)
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">
                    Tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã OTP mỗi khi đăng nhập.
                  </p>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {is2FAEnabled ? 'Đang BẬT' : 'Đang TẮT'}
                    </span>
                    {!showOtpInput ? (
                      <button onClick={handleToggle2FA} className={`px-4 py-1.5 text-xs font-semibold text-white rounded-md transition-colors ${is2FAEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        {is2FAEnabled ? 'Tắt 2FA' : 'Bật 2FA'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Nhập mã OTP..."
                          className="px-2 py-1 text-sm border border-[var(--border)] rounded"
                          value={otp}
                          onChange={e => setOtp(e.target.value)}
                        />
                        <button onClick={handleToggle2FA} className="px-3 py-1 bg-green-500 text-white text-xs rounded">Xác nhận</button>
                        <button onClick={() => setShowOtpInput(false)} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded">Hủy</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SESSIONS TAB */}
            {activeTab === 'sessions' && (
              <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4">
                <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <FaDesktop className="text-indigo-500" />
                  Thiết bị đăng nhập
                </h5>
                <div className="flex flex-col gap-3">
                  {sessions.length === 0 ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-4">Không có dữ liệu.</div>
                  ) : (
                    sessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                        <div>
                          <div className="font-semibold text-sm text-[var(--text-primary)]">{s.device || 'Unknown Device'}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{s.ipAddress || 'Unknown IP'} • {new Date(s.createdAt).toLocaleString()}</div>
                        </div>
                        <button onClick={() => handleRevokeSession(s.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1">
                          <FaTimes /> Đăng xuất
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* REQUESTS TAB */}
            {activeTab === 'requests' && (
              <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4">
                <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <FaTicketAlt className="text-green-500" />
                  Yêu cầu hỗ trợ
                </h5>
                <div className="flex flex-col gap-3">
                  {requests.length === 0 ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-4">Bạn chưa gửi yêu cầu nào.</div>
                  ) : (
                    requests.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                        <div>
                          <div className="font-semibold text-sm text-[var(--text-primary)]">{r.category}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {r.status}
                          </span>
                          {r.status === 'Pending' && (
                            <button onClick={() => handleCancelRequest(r.id)} className="text-red-500 hover:underline text-xs">Hủy</button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4 flex flex-col overflow-hidden h-full">
                <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2 flex-shrink-0">
                  <FaHistory className="text-yellow-500" />
                  Lịch sử check-in của tôi
                </h5>
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {loadingAttendance ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-8 flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải dữ liệu...
                    </div>
                  ) : attendance.length === 0 ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-8">Bạn chưa có lịch sử check-in nào.</div>
                  ) : (
                    <div className="flex flex-col h-full justify-between">
                      <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] uppercase bg-gray-50/50 dark:bg-gray-800/30">
                              <th className="py-3 px-4 font-semibold">Chi nhánh</th>
                              <th className="py-3 px-4 font-semibold">Giờ vào (Check-in)</th>
                              <th className="py-3 px-4 font-semibold">Giờ ra (Check-out)</th>
                              <th className="py-3 px-4 font-semibold">Thời gian tập</th>
                              <th className="py-3 px-4 font-semibold">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]">
                            {attendance
                              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                              .map((item) => {
                                const isCompleted = !!item.checkoutAt;
                                return (
                                  <tr key={item.attendanceId} className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors">
                                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                                      {item.branchName || "Chi nhánh khác"}
                                    </td>
                                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                                      {formatDateTime(item.checkinAt)}
                                    </td>
                                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                                      {formatDateTime(item.checkoutAt)}
                                    </td>
                                    <td className="py-3 px-4 text-[var(--text-primary)] font-medium">
                                      {calculateDuration(item.checkinAt, item.checkoutAt)}
                                    </td>
                                    <td className="py-3 px-4">
                                      {isCompleted ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                          Hoàn thành
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                          Đang tập
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {Math.ceil(attendance.length / itemsPerPage) > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-3 border-t border-[var(--border)] gap-3 flex-shrink-0">
                          <div className="text-xs text-[var(--text-secondary)] font-medium">
                            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, attendance.length)} của {attendance.length} lượt check-in
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="px-2.5 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                              Trước
                            </button>
                            {[...Array(Math.ceil(attendance.length / itemsPerPage))].map((_, idx) => {
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
                              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(attendance.length / itemsPerPage), p + 1))}
                              disabled={currentPage === Math.ceil(attendance.length / itemsPerPage)}
                              className="px-2.5 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                              Sau
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-5 right-5 z-[9999] text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300" style={{ backgroundColor: '#10b981' }}>
          <FaCheckCircle className="text-white text-lg" />
          <div className="text-left">
            <p className="font-bold text-sm">Đổi ảnh đại diện thành công!</p>
            <p className="text-[11px] opacity-90">Ảnh đại diện mới đã được cập nhật.</p>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: var(--text-secondary);
        }
      `}</style>
    </div>
  )
}
