import { useState, useEffect } from "react"
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaBuilding, FaBox, FaDollarSign, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import { getPublicBranches, getPublicPackages, registerAccount } from "../services/publicService"

export default function RegisterModal({ visible, setVisible, initialPackageId }) {
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(false)
  const [error, setError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  const [branches, setBranches] = useState([])
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "Male",
    birthday: "",
    address: "",
    branchId: "",
    packageId: "",
    pricingId: "",
  })

  // Format validation errors to printable string safely
  const formatError = (err) => {
    console.error("=== CHI TIẾT LỖI ĐĂNG KÝ TỪ SERVER ===", {
      status: err.response?.status,
      data: err.response?.data,
      headers: err.response?.headers,
      config: err.config
    });

    const resData = err.response?.data;
    if (!resData) {
      return err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại kết nối mạng.";
    }

    // Trường hợp server trả về plain text (string)
    if (typeof resData === "string") {
      return resData;
    }

    // Trường hợp server trả về object chứa message/error/success
    if (resData.message && typeof resData.message === "string") {
      return resData.message;
    }
    if (resData.Message && typeof resData.Message === "string") {
      return resData.Message;
    }
    if (resData.error && typeof resData.error === "string") {
      return resData.error;
    }
    if (resData.Error && typeof resData.Error === "string") {
      return resData.Error;
    }

    // Trường hợp danh sách validation errors chuẩn của ASP.NET
    if (resData.errors) {
      const errorsObj = resData.errors;
      if (typeof errorsObj === "string") return errorsObj;
      if (typeof errorsObj === "object") {
        return Object.entries(errorsObj)
          .map(([field, msgs]) => {
            const fieldName = field.replace('$.', '').replace('dto.', '');
            const messageText = Array.isArray(msgs) ? msgs.join(', ') : msgs;
            return `• ${fieldName}: ${messageText}`;
          })
          .join('\n');
      }
    }

    return JSON.stringify(resData);
  }

  // Fetch branches and packages on modal open
  useEffect(() => {
    if (!visible) return

    const fetchData = async () => {
      try {
        setFetchingData(true)
        setError(null)
        setSuccessData(null)

        const [branchesData, packagesData] = await Promise.all([
          getPublicBranches(),
          getPublicPackages()
        ])

        // Safe fallback in case API returns nested arrays or structures
        const finalBranches = branchesData?.items || branchesData || []
        const finalPackages = packagesData || []

        setBranches(finalBranches)
        setPackages(finalPackages)

        // Initialize package selection
        const defaultPkgId = initialPackageId || (finalPackages?.[0]?.packageId || finalPackages?.[0]?.id || "")
        let defaultPricingId = ""
        
        if (defaultPkgId) {
          const pkg = finalPackages.find(p => (p.packageId === defaultPkgId || p.id === defaultPkgId))
          if (pkg) {
            setSelectedPackage(pkg)
            const firstPricing = pkg.pricings?.[0]
            defaultPricingId = firstPricing?.pricingId || firstPricing?.packagePricingId || firstPricing?.id || ""
          }
        }

        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          gender: "Male",
          birthday: "",
          address: "",
          branchId: finalBranches?.[0]?.branchId || finalBranches?.[0]?.id || "",
          packageId: defaultPkgId,
          pricingId: defaultPricingId,
        })

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu khởi tạo:", err)
        setError("Không thể tải thông tin gói tập và chi nhánh. Vui lòng thử lại sau.")
      } finally {
        setFetchingData(false)
      }
    }

    fetchData()
  }, [visible, initialPackageId])

  // Update selected package details and pricings when packageId changes
  useEffect(() => {
    if (!formData.packageId || packages.length === 0) return
    const pkg = packages.find(p => (p.packageId === formData.packageId || p.id === formData.packageId))
    setSelectedPackage(pkg || null)
    const firstPricing = pkg?.pricings?.[0]
    setFormData(prev => ({
      ...prev,
      pricingId: firstPricing?.pricingId || firstPricing?.packagePricingId || firstPricing?.id || ""
    }))
  }, [formData.packageId, packages])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Basic Validation
    if (!formData.fullName.trim()) return setError("Họ và tên không được để trống")
    if (!formData.email.trim()) return setError("Email không được để trống")
    if (!formData.phoneNumber.trim()) return setError("Số điện thoại không được để trống")
    if (!formData.birthday) return setError("Vui lòng chọn ngày sinh")
    if (!formData.address.trim()) return setError("Địa chỉ không được để trống")
    if (!formData.branchId) return setError("Vui lòng chọn chi nhánh")
    if (!formData.packageId) return setError("Vui lòng chọn gói tập")
    if (!formData.pricingId) return setError("Vui lòng chọn thời hạn gói")

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      birthday: formData.birthday,
      address: formData.address,
      packageId: formData.packageId,
      pricingId: formData.pricingId,
      branchId: formData.branchId,
    }

    try {
      setLoading(true)
      const res = await registerAccount(payload)
      if (res.success) {
        setSuccessData(res.data)
      } else {
        setError(res.message || "Đăng ký không thành công. Vui lòng thử lại.")
      }
    } catch (err) {
      console.error(err)
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSuccess = () => {
    setSuccessData(null)
    setVisible(false)
  }

  // Handle get selected pricing object
  const getSelectedPricing = () => {
    return selectedPackage?.pricings?.find(
      pr => (pr.pricingId === formData.pricingId || pr.packagePricingId === formData.pricingId || pr.id === formData.pricingId)
    )
  }

  return (
    <>
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(4px); }
        }
        @keyframes modal-scale-in {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-modal-backdrop {
          animation: modal-fade-in 0.3s ease-out forwards;
        }
        .animate-modal-content {
          animation: modal-scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
          visible && !successData ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setVisible(false)}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[50vw] min-w-[450px] bg-white text-gray-800 shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out flex flex-col ${
          visible && !successData ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight uppercase">
              Đăng Ký Hội Viên
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Cung cấp thông tin để chúng tôi chuẩn bị hợp đồng cho bạn
            </p>
          </div>
          <button 
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {fetchingData ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-8 h-8 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-500 text-sm font-medium">Đang tải thông tin gói tập & chi nhánh...</span>
            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 whitespace-pre-line">
                  <FaExclamationCircle className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Thông tin cá nhân</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên *</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại *</label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="09XXXXXXXX"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="vi-du@email.com"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày sinh *</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Giới tính</label>
                    <div className="relative">
                      <FaVenusMars className="absolute left-3 top-3 text-gray-400" />
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors appearance-none"
                      >
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ *</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Số nhà, Tên đường, Quận/Huyện"
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Package & Branches */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Đăng ký dịch vụ</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Branch Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Chi nhánh tập luyện *</label>
                    <div className="relative">
                      <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                      <select 
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors appearance-none"
                        required
                      >
                        <option key="branch-placeholder" value="" disabled>-- Chọn chi nhánh --</option>
                        {branches.map((b, idx) => (
                          <option key={b.branchId || b.id || `branch-${idx}`} value={b.branchId || b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Package Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Gói tập đăng ký *</label>
                    <div className="relative">
                      <FaBox className="absolute left-3 top-3 text-gray-400" />
                      <select 
                        name="packageId"
                        value={formData.packageId}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors appearance-none"
                        required
                      >
                        <option key="pkg-placeholder" value="" disabled>-- Chọn gói tập --</option>
                        {packages.map((p, idx) => (
                          <option key={p.packageId || p.id || `pkg-${idx}`} value={p.packageId || p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing Select */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Thời hạn & Bảng giá *</label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-3 text-gray-400" />
                      <select 
                        name="pricingId"
                        value={formData.pricingId}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-yellow-500 focus:bg-white focus:outline-none rounded-xl py-2.5 pl-9 pr-4 text-sm text-gray-800 transition-colors appearance-none"
                        required
                        disabled={!formData.packageId}
                      >
                        <option key="pricing-placeholder" value="" disabled>-- Chọn thời hạn --</option>
                        {selectedPackage?.pricings?.map((pr, idx) => (
                          <option key={pr.pricingId || pr.packagePricingId || pr.id || `pricing-${idx}`} value={pr.pricingId || pr.packagePricingId || pr.id}>
                            {pr.durationMonths} tháng - {pr.price?.toLocaleString('vi-VN')} VNĐ
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown summary */}
              {selectedPackage && formData.pricingId && (
                <div className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-4 flex items-center justify-between mt-4">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Chi tiết thanh toán</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedPackage.name} | Thời hạn {getSelectedPricing()?.durationMonths} tháng
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tổng cộng</span>
                    <span className="text-base font-black text-yellow-600">
                      {(getSelectedPricing()?.price || 0).toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-yellow-500/10 flex justify-center items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "XÁC NHẬN ĐĂNG KÝ & THANH TOÁN"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Success Modal Popup */}
      {successData && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          {/* Backdrop with animation */}
          <div 
            className="fixed inset-0 bg-black/60 animate-modal-backdrop"
            onClick={handleCloseSuccess}
          />
          
          {/* Modal content card with bounce scale animation */}
          <div className="bg-white text-gray-800 rounded-3xl shadow-2xl z-[2001] max-w-md w-full overflow-hidden transform animate-modal-content flex flex-col border border-gray-100">
            {/* Top Confetti Stripe */}
            <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
            
            {/* Main content body */}
            <div className="p-8 text-center space-y-6">
              {/* Success Circle */}
              <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100 shadow-inner">
                <FaCheckCircle className="text-emerald-500 text-3xl animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  ĐĂNG KÝ THÀNH CÔNG!
                </h3>
                <p className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
                  TÀI KHOẢN ĐÃ ĐƯỢC KHỞI TẠO
                </p>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Chào mừng bạn gia nhập **EnerGym**! Thông tin đăng nhập cùng <strong className="text-yellow-600 font-bold">mật khẩu tạm thời</strong> đã được gửi về email đăng ký:
                <span className="block mt-2 font-bold underline text-yellow-600 text-base break-all bg-yellow-50/50 py-2 px-3 rounded-xl border border-yellow-100/50">
                  {formData.email}
                </span>
                <span className="block mt-2 text-[10px] text-gray-400 italic">
                  (Vui lòng kiểm tra kỹ cả hộp thư Spam/Thư rác nếu không tìm thấy)
                </span>
              </p>

              {/* Receipt card widget */}
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                {/* Decorative cut notches */}
                <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white rounded-full border border-gray-150 -translate-y-1/2" />
                <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white rounded-full border border-gray-150 -translate-y-1/2" />
                
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200/50 pb-2">
                  Tóm tắt hợp đồng
                </h4>
                
                <div className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-500">Hội viên:</span>
                  <span className="font-semibold text-gray-800">{formData.fullName}</span>
                </div>
                <div className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-500">Gói tập:</span>
                  <span className="font-bold text-yellow-600">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-500">Thời hạn:</span>
                  <span className="font-semibold text-gray-800">
                    {getSelectedPricing()?.durationMonths} tháng
                  </span>
                </div>
                <div className="flex justify-between text-xs py-0.5">
                  <span className="text-gray-500">Chi nhánh:</span>
                  <span className="font-semibold text-gray-800">
                    {branches.find(b => (b.branchId === formData.branchId || b.id === formData.branchId))?.name || "Chưa xác định"}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-dashed border-gray-200 mt-2">
                  <span className="text-gray-700 font-bold">Tổng thanh toán:</span>
                  <span className="font-extrabold text-base text-yellow-600">
                    {(getSelectedPricing()?.price || 0).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
            </div>

            {/* Footer action button */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-100">
              <button
                onClick={handleCloseSuccess}
                className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-yellow-500/10 text-center text-sm"
              >
                HOÀN TẤT & ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
