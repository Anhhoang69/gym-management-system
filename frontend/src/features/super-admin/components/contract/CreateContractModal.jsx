import React, { useState, useEffect } from 'react';
import { 
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CCloseButton,
  CButton,
  CFormInput,
  CFormSelect
} from '@coreui/react';
import { User, Package as PackageIcon, CalendarDays, Loader2, CheckCircle2 } from 'lucide-react';
import { getPackages } from '../../services/packageService';
import { getUsers } from '../../services/userService';
import { getPromotions } from '../../services/promotionService';
import { createContractDraft, generateContract } from '../../services/contractService';
import moment from 'moment';

const CreateContractModal = ({
  visible,
  onClose,
  onSuccess 
}) => {
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState([]);
  const [members, setMembers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [draftResult, setDraftResult] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    memberUserId: '',
    packageId: '',
    pricingId: '',
    startDate: moment().format('YYYY-MM-DD'),
    promotionIds: [],
    note: ''
  });

  // Reset form when opened
  useEffect(() => {
    if (visible) {
      setStep(1);
      setError(null);
      setSubmitting(false);
      setDraftResult(null);
      
      setFormData({
        memberUserId: '',
        packageId: '',
        pricingId: '',
        startDate: moment().format('YYYY-MM-DD'),
        promotionIds: [],
        note: ''
      });

      fetchPackages();
      fetchMembers();
      fetchPromotions();
    }
  }, [visible]);

  const fetchPromotions = async () => {
    setLoadingPromotions(true);
    try {
      const data = await getPromotions("", "Active", "");
      setPromotions(data?.items || data || []);
    } catch (err) {
      console.error("Failed to fetch promotions", err);
    } finally {
      setLoadingPromotions(false);
    }
  };

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

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const data = await getUsers(1, 1000, "", "Member", "");
      setMembers(data?.items || []);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const selectedPackage = packages.find(p => (p.packageId || p.id) === formData.packageId);
  const selectedPricing = selectedPackage?.pricings?.find(pr => (pr.packagePricingId || pr.id) === formData.pricingId);
  const selectedMember = members.find(m => m.id === formData.memberUserId);

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.memberUserId || !formData.packageId || !formData.pricingId) {
        setError('Vui lòng chọn đầy đủ Hội viên, Gói tập và Thời hạn');
        return;
      }
      setError(null);
      
      // Attempt to create draft
      try {
        setSubmitting(true);
        const payloadDate = moment(formData.startDate).toISOString();
        const payload = {
          memberUserId: formData.memberUserId,
          packageId: formData.packageId,
          pricingId: formData.pricingId,
          startDate: payloadDate,
          promotionIds: formData.promotionIds,
          note: formData.note || ""
        };

        console.log("=== DEBUG PAYLOAD ===");
        console.log("Selected Member:", members.find(m => (m.id || m.userId) === formData.memberUserId));
        console.log("Payload to send:", JSON.stringify(payload, null, 2));

        const draft = await createContractDraft(payload);
        setDraftResult(draft);
        setStep(2);
      } catch (err) {
        console.error("Failed to create draft", err);
        const errData = err.response?.data;
        let errMsg = "Có lỗi xảy ra khi tạo bản nháp.";
        if (errData) {
          if (typeof errData === 'string') errMsg = errData;
          else if (errData.message) errMsg = errData.message;
          else if (errData.title) {
            if (errData.errors) {
              const firstError = Object.values(errData.errors)[0];
              if (Array.isArray(firstError)) errMsg = firstError[0];
              else errMsg = firstError;
            } else {
              errMsg = errData.title;
            }
          }
        }
        setError(errMsg);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!draftResult?.draftId) {
        throw new Error("Không tìm thấy Draft ID");
      }

      const result = await generateContract({
        draftId: draftResult.draftId
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("Failed to create contract", err);
      const errData = err.response?.data;
      let errMsg = "Có lỗi xảy ra khi tạo hợp đồng.";
      if (errData) {
        if (typeof errData === 'string') errMsg = errData;
        else if (errData.message) errMsg = errData.message;
        else if (errData.title) {
          if (errData.errors) {
            const firstError = Object.values(errData.errors)[0];
            if (Array.isArray(firstError)) errMsg = firstError[0];
            else errMsg = firstError;
          } else {
            errMsg = errData.title;
          }
        }
      }
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <COffcanvas 
      placement="end" 
      visible={visible} 
      onHide={onClose} 
      style={{ width: '50vw' }}
      className="border-0 shadow-xl"
      backdrop={true}
    >
      <COffcanvasHeader className="border-b border-gray-100 bg-gray-50/50 flex justify-between items-center px-6 py-4">
        <COffcanvasTitle className="text-xl font-bold text-gray-800 flex items-center gap-2 m-0">
          Tạo Hợp Đồng Hội Viên Mới
        </COffcanvasTitle>
        <CCloseButton className="text-reset" onClick={onClose} disabled={submitting} />
      </COffcanvasHeader>
      
      <COffcanvasBody className="p-0 flex flex-col h-full overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Stepper Sidebar */}
          <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-100 hidden md:block">
            <div className="space-y-8">
              <div className={`flex items-center gap-3 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <span className="font-medium">Cấu hình hợp đồng</span>
              </div>
              <div className={`flex items-center gap-3 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className="font-medium">Xác nhận</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-2/3 p-6 overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="text-indigo-500" size={20} />
                  Chọn Hội Viên & Gói Tập
                </h3>
                
                {loadingMembers || loadingPackages ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="form-label font-medium text-gray-700">Hội Viên (*)</label>
                      <CFormSelect 
                        value={formData.memberUserId} 
                        onChange={e => setFormData({...formData, memberUserId: e.target.value})}
                      >
                        <option value="">-- Chọn Hội Viên --</option>
                        {members.map((m, idx) => {
                          const mid = m.id || m.userId;
                          return <option key={mid || idx} value={mid}>{m.fullName || m.name} ({m.phone})</option>
                        })}
                      </CFormSelect>
                    </div>

                    <div>
                      <label className="form-label font-medium text-gray-700">Gói tập (*)</label>
                      <CFormSelect 
                        value={formData.packageId} 
                        onChange={e => setFormData({...formData, packageId: e.target.value, pricingId: ''})}
                      >
                        <option value="">-- Chọn Gói Tập --</option>
                        {packages.map((p, idx) => {
                          const pid = p.packageId || p.id;
                          return <option key={pid || idx} value={pid}>{p.name} - {p.tier}</option>;
                        })}
                      </CFormSelect>
                    </div>

                    {selectedPackage && selectedPackage.pricings && (
                      <div>
                        <label className="form-label font-medium text-gray-700">Thời hạn (*)</label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {selectedPackage.pricings.map(pr => {
                            const prid = pr.packagePricingId || pr.id;
                            return (
                            <div 
                              key={prid}
                              onClick={() => setFormData({...formData, pricingId: prid})}
                              className={`cursor-pointer border rounded-xl p-3 transition-all ${formData.pricingId === prid ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-indigo-300'}`}
                            >
                              <div className="font-bold text-gray-800">{pr.durationMonths} Tháng</div>
                              <div className="text-indigo-600 font-semibold">{formatCurrency(pr.price)}</div>
                            </div>
                          )})}
                        </div>
                      </div>
                    )}

                    {promotions.length > 0 && (
                      <div>
                        <label className="form-label font-medium text-gray-700">Khuyến mãi áp dụng</label>
                        <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                          {promotions.map(promo => {
                            const pid = promo.promotionId || promo.id;
                            const isSelected = formData.promotionIds.includes(pid);
                            return (
                              <div 
                                key={pid}
                                onClick={() => {
                                  const newIds = isSelected 
                                    ? formData.promotionIds.filter(id => id !== pid)
                                    : [...formData.promotionIds, pid];
                                  setFormData({...formData, promotionIds: newIds});
                                }}
                                className={`cursor-pointer border rounded-lg p-2 transition-all flex items-center gap-3 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
                              >
                                <input type="checkbox" checked={isSelected} readOnly className="form-check-input mt-0" />
                                <div>
                                  <div className="font-semibold text-gray-800 text-sm">{promo.name || promo.code}</div>
                                  <div className="text-gray-500 text-xs">
                                    {promo.discountType === 'Percentage' ? `Giảm ${promo.discountValue}%` : `Giảm ${formatCurrency(promo.discountValue)}`}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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

                    <div className="pt-2">
                      <CFormInput 
                        label={<span className="font-medium text-gray-700">Ghi chú thêm (Tùy chọn)</span>}
                        value={formData.note}
                        onChange={e => setFormData({...formData, note: e.target.value})}
                        placeholder="VD: Khách hàng mua thêm gói tập..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && draftResult && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Xác Nhận Bản Nháp</h3>
                  <p className="text-gray-500 text-sm mt-1">Kiểm tra thông tin bản nháp hợp đồng trước khi tạo chính thức</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm border border-gray-100">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Hội viên:</span>
                    <span className="font-semibold text-gray-800">{draftResult.memberName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Gói tập:</span>
                    <span className="font-semibold text-gray-800">{draftResult.packageName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Thời gian tập:</span>
                    <span className="font-semibold text-gray-800">{draftResult.durationMonths} tháng</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Bắt đầu từ:</span>
                    <span className="font-semibold text-gray-800">{moment(draftResult.startDate).format('DD/MM/YYYY')}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Kết thúc:</span>
                    <span className="font-semibold text-gray-800">{moment(draftResult.endDate).format('DD/MM/YYYY')}</span>
                  </div>
                  
                  {draftResult.discountAmount > 0 && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Giảm giá:</span>
                      <span className="font-bold text-green-600 text-base">-{formatCurrency(draftResult.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-1">
                    <span className="text-gray-700 font-bold">Tổng tiền thanh toán:</span>
                    <span className="font-bold text-indigo-600 text-base">{formatCurrency(draftResult.dealPrice)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </COffcanvasBody>

      <div className="border-t border-gray-200 bg-white p-4 flex justify-between mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <CButton 
          color="secondary" 
          variant="ghost" 
          onClick={handleBack}
          disabled={submitting || step === 1}
        >
          Quay lại
        </CButton>

        {step < 2 ? (
          <CButton color="primary" onClick={handleNext} disabled={submitting} className="px-6">
            {submitting ? (
              <><Loader2 className="animate-spin" size={16}/> Đang tạo Nháp...</>
            ) : (
              'Tiếp tục'
            )}
          </CButton>
        ) : (
          <CButton color="success" className="text-white flex items-center gap-2 px-6 shadow-md" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <><Loader2 className="animate-spin" size={16}/> Đang tạo HĐ...</>
            ) : (
              'Xác nhận & Chuyển sang Thanh toán'
            )}
          </CButton>
        )}
      </div>
    </COffcanvas>
  );
};

export default CreateContractModal;
