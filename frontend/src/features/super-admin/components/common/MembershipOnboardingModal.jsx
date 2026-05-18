import React, { useState, useEffect } from 'react';
import { 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect
} from '@coreui/react';
import { User, Package as PackageIcon, CalendarDays, Loader2, CheckCircle2 } from 'lucide-react';
import { getPackages } from '../../services/packageService';
import { quickRegister } from '../../services/memberService';
import { convertToMember } from '../../services/leadService';
import moment from 'moment';

const MembershipOnboardingModal = ({
  visible,
  onClose,
  mode = 'quick-register', // 'quick-register' or 'convert-lead'
  leadData = null, // provided if mode is convert-lead
  onSuccess // passes { invoiceId, contractId, totalAmountDue, invoiceCode }
}) => {
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    packageId: '',
    pricingId: '',
    startDate: moment().format('YYYY-MM-DD'),
    note: ''
  });

  // Reset form when opened
  useEffect(() => {
    if (visible) {
      setStep(mode === 'convert-lead' ? 2 : 1); // Skip step 1 for convert lead
      setError(null);
      setSubmitting(false);
      
      if (mode === 'convert-lead' && leadData) {
        setFormData({
          fullName: leadData.name || '',
          phone: leadData.phone || '',
          email: leadData.email || '',
          packageId: '',
          pricingId: '',
          startDate: moment().format('YYYY-MM-DD'),
          note: ''
        });
      } else {
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          packageId: '',
          pricingId: '',
          startDate: moment().format('YYYY-MM-DD'),
          note: ''
        });
      }

      fetchPackages();
    }
  }, [visible, mode, leadData]);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const data = await getPackages('', 'Active');
      setPackages(data || []);
    } catch (err) {
      console.error("Failed to fetch packages", err);
    } finally {
      setLoadingPackages(false);
    }
  };

  const selectedPackage = packages.find(p => p.id === formData.packageId);
  const selectedPricing = selectedPackage?.pricings?.find(pr => pr.id === formData.pricingId);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone) {
        setError('Vui lòng nhập đầy đủ Họ tên và Số điện thoại');
        return;
      }
      setError(null);
      setStep(2);
    } else if (step === 2) {
      if (!formData.packageId || !formData.pricingId) {
        setError('Vui lòng chọn Gói tập và Thời hạn');
        return;
      }
      setError(null);
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2 && mode === 'convert-lead') {
      onClose(); // Can't go back to step 1 for convert lead
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      let result;
      const payloadDate = moment(formData.startDate).toISOString();

      if (mode === 'quick-register') {
        result = await quickRegister({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          packageId: formData.packageId,
          pricingId: formData.pricingId,
          startDate: payloadDate,
          note: formData.note
        });
      } else {
        result = await convertToMember(leadData.leadId, {
          packageId: formData.packageId,
          pricingId: formData.pricingId,
          startDate: payloadDate,
          note: formData.note
        });
      }

      // result should be { invoiceId, contractId, totalAmountDue, invoiceCode }
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("Failed to onboard", err);
      setError(err.response?.data?.message || err.response?.data || "Có lỗi xảy ra khi tạo hợp đồng.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <CModal visible={visible} onClose={onClose} alignment="center" size="lg" backdrop="static">
      <CModalHeader closeButton={!submitting} className="border-b border-gray-100 bg-gray-50/50">
        <CModalTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {mode === 'convert-lead' ? 'Chuyển Đổi Hội Viên' : 'Đăng Ký Hội Viên Nhanh'}
        </CModalTitle>
      </CModalHeader>
      
      <CModalBody className="p-0">
        <div className="flex">
          {/* Stepper Sidebar */}
          <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-100 hidden md:block">
            <div className="space-y-8">
              <div className={`flex items-center gap-3 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <span className="font-medium">Thông tin cá nhân</span>
              </div>
              <div className={`flex items-center gap-3 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className="font-medium">Chọn Gói tập</span>
              </div>
              <div className={`flex items-center gap-3 ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-indigo-100' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <span className="font-medium">Xác nhận</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-2/3 p-6 min-h-[400px]">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="text-indigo-500" size={20} />
                  Thông tin Hội Viên
                </h3>
                <div className="space-y-4">
                  <CFormInput 
                    label="Họ và Tên (*)" 
                    value={formData.fullName} 
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    disabled={mode === 'convert-lead'} // Read-only if convert
                  />
                  <CFormInput 
                    label="Số điện thoại (*)" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    disabled={mode === 'convert-lead'}
                  />
                  <CFormInput 
                    type="email" 
                    label="Email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    disabled={mode === 'convert-lead'}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <PackageIcon className="text-indigo-500" size={20} />
                  Chọn Gói Tập
                </h3>
                {loadingPackages ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="form-label font-medium text-gray-700">Gói tập (*)</label>
                      <CFormSelect 
                        value={formData.packageId} 
                        onChange={e => setFormData({...formData, packageId: e.target.value, pricingId: ''})}
                      >
                        <option value="">-- Chọn Gói Tập --</option>
                        {packages.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - {p.tier}</option>
                        ))}
                      </CFormSelect>
                    </div>

                    {selectedPackage && selectedPackage.pricings && (
                      <div>
                        <label className="form-label font-medium text-gray-700">Thời hạn (*)</label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {selectedPackage.pricings.map(pr => (
                            <div 
                              key={pr.id}
                              onClick={() => setFormData({...formData, pricingId: pr.id})}
                              className={`cursor-pointer border rounded-xl p-3 transition-all ${formData.pricingId === pr.id ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-indigo-300'}`}
                            >
                              <div className="font-bold text-gray-800">{pr.durationMonths} Tháng</div>
                              <div className="text-indigo-600 font-semibold">{formatCurrency(pr.price)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <label className="form-label font-medium text-gray-700 flex items-center gap-2">
                        <CalendarDays size={16} /> Ngày bắt đầu
                      </label>
                      <CFormInput 
                        type="date" 
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Xác Nhận Đăng Ký</h3>
                  <p className="text-gray-500 text-sm mt-1">Kiểm tra thông tin trước khi tạo hợp đồng</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm border border-gray-100">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Hội viên:</span>
                    <span className="font-semibold text-gray-800">{formData.fullName} ({formData.phone})</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Gói tập:</span>
                    <span className="font-semibold text-gray-800">{selectedPackage?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Thời hạn:</span>
                    <span className="font-semibold text-gray-800">{selectedPricing?.durationMonths} tháng</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Bắt đầu từ:</span>
                    <span className="font-semibold text-gray-800">{moment(formData.startDate).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-700 font-bold">Tổng tiền (Dự kiến):</span>
                    <span className="font-bold text-indigo-600 text-base">{formatCurrency(selectedPricing?.price)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <CFormInput 
                    label="Ghi chú thêm (Tùy chọn)" 
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                    placeholder="VD: Khách đăng ký gói khuyến mãi..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CModalBody>

      <CModalFooter className="border-t border-gray-100 bg-gray-50/50 flex justify-between">
        <CButton 
          color="secondary" 
          variant="ghost" 
          onClick={handleBack}
          disabled={submitting || (step === 1 && mode !== 'convert-lead') || (step === 2 && mode === 'convert-lead')}
        >
          Quay lại
        </CButton>

        {step < 3 ? (
          <CButton color="primary" onClick={handleNext}>
            Tiếp tục
          </CButton>
        ) : (
          <CButton color="success" className="text-white flex items-center gap-2" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <><Loader2 className="animate-spin" size={16}/> Đang tạo HĐ...</>
            ) : (
              'Xác nhận & Chuyển sang Thanh toán'
            )}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default MembershipOnboardingModal;
