import { useState, useEffect, useRef } from "react"
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaCheckCircle, FaHistory, FaTicketAlt, FaKey, FaDesktop, FaTimes } from "react-icons/fa"
import { changePassword, send2FAOtp, enable2FA, disable2FA } from '../../auth/services/authService'
import { getMyProfile, updateMyProfile, getLoginHistory, revokeSession, getMyRequests, cancelRequest, getMyAttendance, uploadImage } from '../services/memberService'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { createVNPayUrl } from "../../payment/services/vnpayService"

export default function MemberProfilePage() {
  const { t, locale } = useLanguage()
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
  const [paying, setPaying] = useState(false);

  const handleVNPayPayment = async (invoiceId) => {
    if (!invoiceId) {
      alert("Không tìm thấy thông tin hóa đơn.");
      return;
    }
    try {
      setPaying(true);
      const data = await createVNPayUrl(invoiceId);
      if (data && data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      } else {
        alert("Không thể khởi tạo liên kết thanh toán VNPay.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo liên kết thanh toán: " + (err.response?.data?.message || err.message));
    } finally {
      setPaying(false);
    }
  };

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
    return date.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
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
          joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US') : "N/A",
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
      alert(`${t('profilePage.avatar.errorUpload')} ${typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg}`)
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

      alert(t('profilePage.general.successAlert'))
    } catch (e) {
      alert(t('profilePage.general.errorAlert'));
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert(t('profilePage.security.mismatchAlert'))
      return
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      alert(t('profilePage.security.successPasswordAlert'))
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (e) {
      alert(t('profilePage.security.errorPasswordAlert'));
    }
  }

  const handleToggle2FA = async () => {
    if (is2FAEnabled) {
      // Disable 2FA
      if (!showOtpInput) {
        await send2FAOtp();
        setShowOtpInput(true);
        alert(t('profilePage.security.otpSentDisable'));
      } else {
        try {
          await disable2FA({ otpCode: otp });
          setIs2FAEnabled(false);
          setShowOtpInput(false);
          setOtp("");
          alert(t('profilePage.security.statusOff'));
        } catch (e) { alert(t('profilePage.security.otpInvalid')); }
      }
    } else {
      // Enable 2FA
      if (!showOtpInput) {
        await send2FAOtp();
        setShowOtpInput(true);
        alert(t('profilePage.security.otpSentEnable'));
      } else {
        try {
          await enable2FA({ otpCode: otp });
          setIs2FAEnabled(true);
          setShowOtpInput(false);
          setOtp("");
          alert(t('profilePage.security.statusOn'));
        } catch (e) { alert(t('profilePage.security.otpInvalid')); }
      }
    }
  }

  const handleRevokeSession = async (id) => {
    try {
      await revokeSession(id);
      fetchSessions();
      alert(t('profilePage.sessions.revokeSuccess'));
    } catch (e) { alert(t('profilePage.sessions.revokeError')); }
  }

  const handleCancelRequest = async (id) => {
    try {
      await cancelRequest(id);
      fetchRequests();
      alert(t('profilePage.requests.cancelSuccess'));
    } catch (e) { alert(t('profilePage.requests.cancelError')); }
  }

  return (
    <div className="w-full px-4 md:px-8 py-4 flex flex-col" style={{ height: "calc(100vh - 70px)" }}>
      {/* Header section - compact */}
      <div className="mt-2 mb-2 flex-shrink-0 flex items-center justify-center w-full">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">{t('profilePage.title')}</h3>
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
                  title={t('profilePage.general.updateTitle')}
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
                  <div className="text-xs text-[var(--text-secondary)] mb-2">{t('profilePage.status')}</div>
                  <div className="text-sm font-semibold text-green-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {t('profilePage.active')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-secondary)] mb-2">{t('profilePage.joinDate')}</div>
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
            <button onClick={() => setActiveTab('general')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'general' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>{t('profilePage.tabs.general')}</button>
            <button onClick={() => setActiveTab('membership')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'membership' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>{t('profilePage.tabs.membership')}</button>
            <button onClick={() => setActiveTab('security')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'security' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>{t('profilePage.tabs.security')}</button>
            <button onClick={() => setActiveTab('sessions')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'sessions' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>{t('profilePage.tabs.sessions')}</button>
            <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'requests' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>{t('profilePage.tabs.requests')}</button>
            <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${activeTab === 'attendance' ? 'border-[var(--brand)] text-[var(--brand)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>{t('profilePage.tabs.attendance')}</button>
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
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{t('profilePage.membership.memberCard')}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.memberInfo?.cardStatus === 'Active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/35 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-950/35 dark:text-red-400'
                    }`}>
                      {user.memberInfo?.cardStatus === 'Active' ? t('profilePage.membership.cardStatusActive') : t('profilePage.membership.cardStatusInactive')}
                    </span>
                  </div>

                  <div className="mt-6 z-10 text-left">
                    <div className="text-[10px] text-[var(--text-secondary)] uppercase">{t('profilePage.membership.cardCode')}</div>
                    <div className="text-xl font-mono font-bold text-[var(--text-primary)] tracking-wider mt-0.5">
                      {user.memberInfo?.cardCode || t('profilePage.membership.noCard')}
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-6 z-10 text-left">
                    <div>
                      <div className="text-[9px] text-[var(--text-secondary)] uppercase">{t('profilePage.membership.cardHolder')}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)] uppercase">{user.fullName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-[var(--text-secondary)] uppercase">{t('profilePage.membership.expires')}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {user.memberInfo?.cardExpireDate ? new Date(user.memberInfo.cardExpireDate).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US') : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract details */}
                <div className="flex-[1.5] bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-6">
                  <h5 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-yellow-500" />
                    {t('profilePage.membership.currentContract')}
                  </h5>
                  
                  {user.memberInfo?.activeContract ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">{t('profilePage.membership.packageName')}</div>
                          <div className="text-base font-bold text-[var(--text-primary)] mt-0.5">
                            {t('profilePage.membership.packageTitle').replace('{name}', user.memberInfo.activeContract.packageName)}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">{t('profilePage.membership.contractStatus')}</div>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            user.memberInfo.activeContract.status === 'Active' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-950/35 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/35 dark:text-yellow-400'
                          }`}>
                            {user.memberInfo.activeContract.status === 'Active' ? t('profilePage.membership.contractStatusActive') : user.memberInfo.activeContract.status}
                          </span>
                        </div>
                      </div>

                      {user.memberInfo.activeContract.status === 'Pending' && (
                        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-left">
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            ⚠️ Hợp đồng của bạn đang chờ thanh toán. Vui lòng thanh toán số tiền{' '}
                            <strong className="text-[var(--brand)] font-extrabold text-sm">
                              {new Intl.NumberFormat('vi-VN').format(user.memberInfo.activeContract.totalAmount || 0)} VND
                            </strong>{' '}
                            để kích hoạt thẻ tập.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleVNPayPayment(user.memberInfo.activeContract.invoiceId)}
                            disabled={paying}
                            className="mt-3 w-full py-2.5 px-4 rounded-lg bg-yellow-500 hover:brightness-95 active:scale-[0.98] text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                          >
                            {paying ? 'Đang xử lý...' : '💳 Thanh toán ngay qua VNPay'}
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-3">
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">{t('profilePage.membership.startDate')}</div>
                          <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                            {new Date(user.memberInfo.activeContract.startDate).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">{t('profilePage.membership.endDate')}</div>
                          <div className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                            {new Date(user.memberInfo.activeContract.endDate).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-3">
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">{t('profilePage.membership.ptSessionsLeft')}</div>
                          <div className="text-sm font-bold text-yellow-500 mt-0.5">
                            {user.memberInfo.activeContract.remainingPrivateSessions} {t('profilePage.membership.sessionUnit')}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-[var(--text-secondary)]">{t('profilePage.membership.groupSessionsLeft')}</div>
                          <div className="text-sm font-bold text-yellow-500 mt-0.5">
                            {user.memberInfo.activeContract.remainingGroupSessions} {t('profilePage.membership.sessionUnit')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--text-secondary)]">
                      {t('profilePage.membership.noContract')}
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
                  {t('profilePage.general.updateTitle')}
                </h5>
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{t('profilePage.general.fullName')}</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{t('profilePage.general.role')}</label>
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
                        <FaEnvelope className="text-gray-400" /> {t('profilePage.general.email')}
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
                        <FaPhone className="text-gray-400" /> {t('profilePage.general.phone')}
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
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{t('profilePage.general.gender')}</label>
                      <select
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.gender}
                        onChange={(e) => setUser({ ...user, gender: e.target.value })}
                      >
                        <option value="Male">{t('profilePage.general.genderMale')}</option>
                        <option value="Female">{t('profilePage.general.genderFemale')}</option>
                        <option value="Other">{t('profilePage.general.genderOther')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{t('profilePage.general.birthday')}</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                        value={user.birthday}
                        onChange={(e) => setUser({ ...user, birthday: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">{t('profilePage.general.address')}</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                      value={user.address}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end mt-3">
                    <button type="submit" className="px-4 py-2 bg-[var(--brand)] hover:brightness-110 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5">
                      <FaCheckCircle /> {t('profilePage.general.updateBtn')}
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
                    {t('profilePage.security.changePassword')}
                  </h5>
                  <form onSubmit={handleUpdatePassword}>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">{t('profilePage.security.currentPassword')}</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                        placeholder={t('profilePage.security.currentPasswordPlaceholder')}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">{t('profilePage.security.newPassword')}</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                          placeholder={t('profilePage.security.newPasswordPlaceholder')}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">{t('profilePage.security.confirmPassword')}</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                          placeholder={t('profilePage.security.confirmPasswordPlaceholder')}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5">
                        <FaKey /> {t('profilePage.security.changePasswordBtn')}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-4">
                  <h5 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                    <FaLock className="text-blue-500" />
                    {t('profilePage.security.twoFactor')}
                  </h5>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">
                    {t('profilePage.security.twoFactorDesc')}
                  </p>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${is2FAEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {is2FAEnabled ? t('profilePage.security.statusOn') : t('profilePage.security.statusOff')}
                    </span>
                    {!showOtpInput ? (
                      <button onClick={handleToggle2FA} className={`px-4 py-1.5 text-xs font-semibold text-white rounded-md transition-colors ${is2FAEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        {is2FAEnabled ? t('profilePage.security.btnDisable') : t('profilePage.security.btnEnable')}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={t('profilePage.security.otpPlaceholder')}
                          className="px-2 py-1 text-sm border border-[var(--border)] rounded"
                          value={otp}
                          onChange={e => setOtp(e.target.value)}
                        />
                        <button onClick={handleToggle2FA} className="px-3 py-1 bg-green-500 text-white text-xs rounded">{t('profilePage.security.btnConfirm')}</button>
                        <button onClick={() => setShowOtpInput(false)} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded">{t('profilePage.security.btnCancel')}</button>
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
                  {t('profilePage.sessions.title')}
                </h5>
                <div className="flex flex-col gap-3">
                  {sessions.length === 0 ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-4">{t('profilePage.sessions.empty')}</div>
                  ) : (
                    sessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                        <div>
                          <div className="font-semibold text-sm text-[var(--text-primary)]">{s.device || 'Unknown Device'}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{s.ipAddress || 'Unknown IP'} • {new Date(s.createdAt).toLocaleString()}</div>
                        </div>
                        <button onClick={() => handleRevokeSession(s.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1">
                          <FaTimes /> {t('profilePage.sessions.logoutBtn')}
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
                  {t('profilePage.requests.title')}
                </h5>
                <div className="flex flex-col gap-3">
                  {requests.length === 0 ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-4">{t('profilePage.requests.empty')}</div>
                  ) : (
                    requests.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg">
                        <div>
                          <div className="font-semibold text-sm text-[var(--text-primary)]">{r.category}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${r.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {r.status === 'Pending' ? t('profilePage.requests.statusPending') : r.status}
                          </span>
                          {r.status === 'Pending' && (
                            <button onClick={() => handleCancelRequest(r.id)} className="text-red-500 hover:underline text-xs">{t('profilePage.requests.cancelBtn')}</button>
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
                  {t('profilePage.attendance.title')}
                </h5>
                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {loadingAttendance ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-8 flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                      {t('profilePage.attendance.loading')}
                    </div>
                  ) : attendance.length === 0 ? (
                    <div className="text-sm text-[var(--text-secondary)] text-center py-8">{t('profilePage.attendance.empty')}</div>
                  ) : (
                    <div className="flex flex-col h-full justify-between">
                      <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] uppercase bg-gray-50/50 dark:bg-gray-800/30">
                              <th className="py-3 px-4 font-semibold">{t('profilePage.attendance.tableBranch')}</th>
                              <th className="py-3 px-4 font-semibold">{t('profilePage.attendance.tableCheckin')}</th>
                              <th className="py-3 px-4 font-semibold">{t('profilePage.attendance.tableCheckout')}</th>
                              <th className="py-3 px-4 font-semibold">{t('profilePage.attendance.tableDuration')}</th>
                              <th className="py-3 px-4 font-semibold">{t('profilePage.attendance.tableStatus')}</th>
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
                                          {t('profilePage.attendance.statusCompleted')}
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                          {t('profilePage.attendance.statusActive')}
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
                            {t('profilePage.attendance.paginationText')
                              .replace('{from}', ((currentPage - 1) * itemsPerPage) + 1)
                              .replace('{to}', Math.min(currentPage * itemsPerPage, attendance.length))
                              .replace('{total}', attendance.length)}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="px-2.5 py-1 text-xs font-medium rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                              {t('profilePage.attendance.btnPrev')}
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
                              {t('profilePage.attendance.btnNext')}
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
            <p className="font-bold text-sm">{t('profilePage.avatar.successToastTitle')}</p>
            <p className="text-[11px] opacity-90">{t('profilePage.avatar.successToastDesc')}</p>
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
