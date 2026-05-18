import { useState, useEffect } from "react"
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaCheckCircle, FaHistory, FaTicketAlt, FaKey, FaDesktop, FaTimes } from "react-icons/fa"
import { changePassword, send2FAOtp, enable2FA, disable2FA } from '../../auth/services/authService'
import { getMyProfile, updateMyProfile, getLoginHistory, revokeSession, getMyRequests, cancelRequest } from '../services/memberService'

export default function MemberProfilePage() {
  const [activeTab, setActiveTab] = useState('general'); // general, security, sessions, requests
  
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Member",
    avatar: "https://i.pravatar.cc/150",
    joinDate: "N/A"
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [])

  useEffect(() => {
    if (activeTab === 'sessions') fetchSessions();
    if (activeTab === 'requests') fetchRequests();
  }, [activeTab])

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      if (data) {
        setUser({
          ...user,
          fullName: data.fullName || data.email?.split('@')[0],
          email: data.email,
          phone: data.phoneNumber || "",
          role: "Member",
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN') : "N/A"
        });
        setIs2FAEnabled(data.twoFactorEnabled);
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
            fullName: parsed.email ? parsed.email.split('@')[0] : user.fullName
          })
        } catch (err) {}
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await updateMyProfile(user);
      alert("Cập nhật thông tin thành công!")
    } catch(e) {
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
    } catch(e) {
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
          await disable2FA({ otp });
          setIs2FAEnabled(false);
          setShowOtpInput(false);
          setOtp("");
          alert("Đã tắt 2FA.");
        } catch(e) { alert("OTP không hợp lệ."); }
      }
    } else {
      // Enable 2FA
      if (!showOtpInput) {
        await send2FAOtp();
        setShowOtpInput(true);
        alert("Mã OTP đã được gửi. Vui lòng nhập để xác nhận BẬT 2FA.");
      } else {
        try {
          await enable2FA({ otp });
          setIs2FAEnabled(true);
          setShowOtpInput(false);
          setOtp("");
          alert("Đã bật 2FA.");
        } catch(e) { alert("OTP không hợp lệ."); }
      }
    }
  }

  const handleRevokeSession = async (id) => {
    try {
      await revokeSession(id);
      fetchSessions();
      alert("Đã thu hồi phiên đăng nhập.");
    } catch(e) { alert("Lỗi khi thu hồi phiên."); }
  }

  const handleCancelRequest = async (id) => {
    try {
      await cancelRequest(id);
      fetchRequests();
      alert("Đã hủy yêu cầu.");
    } catch(e) { alert("Lỗi khi hủy yêu cầu."); }
  }

  return (
    <div className="w-full px-4 md:px-8 py-4 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
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
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover bg-white"
                />
                <button
                  className="absolute bottom-0 right-0 bg-yellow-500 text-white p-1.5 rounded-full shadow-md hover:bg-yellow-600 transition-colors"
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
            <button onClick={() => setActiveTab('security')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'security' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Bảo mật</button>
            <button onClick={() => setActiveTab('sessions')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'sessions' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Phiên đăng nhập</button>
            <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'requests' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>Yêu cầu của tôi</button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4">
                <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <FaUser className="text-yellow-500" />
                  Cập nhật thông tin
                </h5>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Họ và tên</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Vai trò</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed text-sm"
                        value={user.role}
                        disabled
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-1">
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
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-1">
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

                  <div className="flex justify-end mt-4">
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

          </div>
        </div>
      </div>

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
