import { useState } from "react"
import {
  CForm, CRow, CCol, CFormLabel, CFormInput, CFormSelect, CFormCheck, CButton,
  CCard, CCardBody, CCardHeader
} from "@coreui/react"

function PackageForm({ formId, initialData = {}, onSubmit, onClose }) {

  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    tier: initialData.tier || "Basic",
    maxCheckinsPerWeek: initialData.maxCheckinsPerWeek || 7,
    isPtIncluded: initialData.isPtIncluded || false,
    privatePtLimit: initialData.privatePtLimit || 0,
    groupPtLimit: initialData.groupPtLimit || 0,
    features: initialData.features || [],
    pricings: initialData.pricings || [],
    changeFeeDefault: initialData.policy?.changeFeeDefault || "",
    prorationRule: initialData.policy?.prorationRule || "Standard",
    freezeAllowed: initialData.policy?.freezeAllowed || false,
    maxFreezeDays: initialData.policy?.maxFreezeDays || "",
    freezeFee: initialData.policy?.freezeFee || ""
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    })
  }

  /* FEATURES */
  const addFeature = () => {
    setForm({
      ...form,
      features: [...form.features, { packageFeatureId: null, content: "", displayOrder: form.features.length + 1 }]
    })
  }

  const updateFeature = (index, value) => {
    const updated = [...form.features]
    updated[index].content = value
    setForm({ ...form, features: updated })
  }

  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index)
    setForm({ ...form, features: updated })
  }

  /* PRICING */
  const addPricing = () => {
    setForm({
      ...form,
      pricings: [...form.pricings, { packagePricingId: null, durationMonths: 1, price: 0, originalPrice: 0 }]
    })
  }

  const updatePricing = (index, field, value) => {
    const updated = [...form.pricings]
    updated[index][field] = value
    setForm({ ...form, pricings: updated })
  }

  const removePricing = (index) => {
    const updated = form.pricings.filter((_, i) => i !== index)
    setForm({ ...form, pricings: updated })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tierMap = { Basic: 0, Premium: 1, Elite: 2 }
    const prorationMap = { Standard: 0, Prorated: 1 }

    const payload = {
      name: form.name,
      description: form.description,
      tier: tierMap[form.tier],
      isPtIncluded: form.isPtIncluded,
      privatePtLimit: Number(form.privatePtLimit),
      groupPtLimit: Number(form.groupPtLimit),
      maxCheckinsPerWeek: Number(form.maxCheckinsPerWeek),
      features: form.features,
      pricings: form.pricings.map(p => ({
        ...p,
        durationMonths: Number(p.durationMonths),
        price: Number(p.price),
        originalPrice: Number(p.originalPrice)
      })),
      policy: {
        changeFeeDefault: Number(form.changeFeeDefault),
        prorationRule: prorationMap[form.prorationRule],
        freezeAllowed: form.freezeAllowed,
        maxFreezeDays: Number(form.maxFreezeDays),
        freezeFee: Number(form.freezeFee)
      }
    }
    onSubmit(payload)
  }

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
        <CForm id={formId} onSubmit={handleSubmit}>
            
            {/* ROW 1 */}
            <div className="row g-4 mb-4">
                
                {/* ROW 1, COL 1: Thông tin cơ bản & Tiện ích */}
                <div className="col-lg-6 d-flex flex-column gap-4">
                    
                    <CCard className="border-0 shadow-sm">
                        <CCardHeader className="bg-white border-bottom-0 pt-4 pb-0">
                            <h5 className="fw-bold text-primary">Thông tin cơ bản</h5>
                        </CCardHeader>
                        <CCardBody>
                            <CRow className="mb-3">
                                <CCol md={8}>
                                    <CFormLabel className="small fw-semibold text-muted">Tên gói tập</CFormLabel>
                                    <CFormInput name="name" value={form.name} onChange={handleChange} placeholder="VD: Gói Tập Basic 6 Tháng"/>
                                </CCol>
                                <CCol md={4}>
                                    <CFormLabel className="small fw-semibold text-muted">Phân hạng (Tier)</CFormLabel>
                                    <CFormSelect name="tier" value={form.tier} onChange={handleChange}>
                                        <option>Basic</option>
                                        <option>Premium</option>
                                        <option>Elite</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol md={12}>
                                    <CFormLabel className="small fw-semibold text-muted">Mô tả ngắn</CFormLabel>
                                    <CFormInput name="description" value={form.description} onChange={handleChange} placeholder="Mô tả hấp dẫn về gói tập này..."/>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>

                    <CCard className="border-0 shadow-sm flex-grow-1">
                        <CCardHeader className="bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold text-primary mb-0">Tiện ích đi kèm</h5>
                            <CButton color="warning" variant="outline" size="sm" onClick={addFeature}>
                                + Thêm tiện ích
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            {form.features.length === 0 && (
                                <div className="text-muted small text-center p-3 bg-light rounded border border-dashed">
                                    Chưa có tiện ích nào. Bấm "+ Thêm tiện ích" để bắt đầu.
                                </div>
                            )}
                            {form.features.map((f, i) => (
                                <div key={i} className="mb-2">
                                    <div className="input-group">
                                        <input
                                            className="form-control bg-light border-end-0"
                                            placeholder="VD: Miễn phí xông hơi..."
                                            value={f.content}
                                            onChange={(e) => updateFeature(i, e.target.value)}
                                        />
                                        <button type="button" className="btn btn-outline-danger px-3" onClick={() => removeFeature(i)} title="Xóa tiện ích">
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </CCardBody>
                    </CCard>

                </div>

                {/* ROW 1, COL 2: Bảng giá */}
                <div className="col-lg-6">
                    <CCard className="border-0 shadow-sm h-100">
                        <CCardHeader className="bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold text-primary mb-0">Bảng giá (Pricings)</h5>
                            <CButton color="warning" variant="outline" size="sm" onClick={addPricing}>
                                + Thêm tùy chọn giá
                            </CButton>
                        </CCardHeader>
                        <CCardBody>
                            {form.pricings.length === 0 && (
                                <div className="text-muted small text-center p-3 bg-light rounded border border-dashed mb-3">
                                    Gói tập chưa có giá. Cần ít nhất 1 bảng giá để bán.
                                </div>
                            )}
                            {form.pricings.map((p, i) => (
                                <div key={i} className="p-3 bg-light rounded border mb-3">
                                    <CRow className="align-items-end g-2">
                                        <CCol md={3}>
                                            <CFormLabel className="small fw-semibold text-muted mb-1">Thời hạn (Tháng)</CFormLabel>
                                            <CFormInput type="number" min="1" value={p.durationMonths} onChange={(e) => updatePricing(i, "durationMonths", e.target.value)} />
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormLabel className="small fw-semibold text-muted mb-1">Giá thực bán</CFormLabel>
                                            <CFormInput type="number" min="0" value={p.price} onChange={(e) => updatePricing(i, "price", e.target.value)} />
                                        </CCol>
                                        <CCol md={4}>
                                            <CFormLabel className="small fw-semibold text-muted mb-1">Giá gốc</CFormLabel>
                                            <CFormInput type="number" min="0" value={p.originalPrice} onChange={(e) => updatePricing(i, "originalPrice", e.target.value)} />
                                        </CCol>
                                        <CCol md={1}>
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-danger w-100" 
                                                onClick={() => removePricing(i)}
                                                title="Xóa giá này"
                                            >
                                                X
                                            </button>
                                        </CCol>
                                    </CRow>
                                </div>
                            ))}
                        </CCardBody>
                    </CCard>
                </div>

            </div>

            {/* ROW 2 */}
            <div className="row g-4">
                
                {/* ROW 2, COL 1: Thông số quy định */}
                <div className="col-lg-6">
                    <CCard className="border-0 shadow-sm h-100">
                        <CCardHeader className="bg-white border-bottom-0 pt-4 pb-0">
                            <h5 className="fw-bold text-primary">Thông số & Quy định</h5>
                        </CCardHeader>
                        <CCardBody>
                            <CRow className="mb-3">
                                <CCol md={12}>
                                    <CFormLabel className="small fw-semibold text-muted">Số lần Check-in tối đa / tuần</CFormLabel>
                                    <CFormInput type="number" name="maxCheckinsPerWeek" value={form.maxCheckinsPerWeek} onChange={handleChange} placeholder="VD: 7 (không giới hạn)"/>
                                </CCol>
                            </CRow>
                            <div className="p-3 bg-light rounded border mb-3">
                                <CFormCheck 
                                    id="isPtIncluded" 
                                    name="isPtIncluded" 
                                    label={<span className="fw-semibold">Gói tập có kèm Huấn luyện viên (PT)?</span>}
                                    checked={form.isPtIncluded} 
                                    onChange={handleChange}
                                />
                            </div>
                            {form.isPtIncluded && (
                                <CRow>
                                    <CCol md={6}>
                                        <CFormLabel className="small fw-semibold text-muted">Số buổi PT Cá nhân</CFormLabel>
                                        <CFormInput type="number" name="privatePtLimit" value={form.privatePtLimit} onChange={handleChange}/>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel className="small fw-semibold text-muted">Số buổi PT Nhóm</CFormLabel>
                                        <CFormInput type="number" name="groupPtLimit" value={form.groupPtLimit} onChange={handleChange}/>
                                    </CCol>
                                </CRow>
                            )}
                        </CCardBody>
                    </CCard>
                </div>

                {/* ROW 2, COL 2: Chính sách đặc biệt */}
                <div className="col-lg-6">
                    <CCard className="border-0 shadow-sm h-100">
                        <CCardHeader className="bg-white border-bottom-0 pt-4 pb-0">
                            <h5 className="fw-bold text-primary">Chính sách đặc biệt</h5>
                        </CCardHeader>
                        <CCardBody>
                            <div className="p-3 bg-light rounded border mb-3">
                                <CFormCheck 
                                    id="freezeAllowed" 
                                    name="freezeAllowed" 
                                    label={<span className="fw-semibold">Cho phép bảo lưu (Freeze)?</span>}
                                    checked={form.freezeAllowed} 
                                    onChange={handleChange}
                                />
                            </div>
                            {form.freezeAllowed && (
                                <CRow className="mb-3">
                                    <CCol md={6}>
                                        <CFormLabel className="small fw-semibold text-muted">Số ngày bảo lưu tối đa</CFormLabel>
                                        <CFormInput type="number" name="maxFreezeDays" value={form.maxFreezeDays} onChange={handleChange}/>
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel className="small fw-semibold text-muted">Phí bảo lưu</CFormLabel>
                                        <CFormInput type="number" name="freezeFee" value={form.freezeFee} onChange={handleChange}/>
                                    </CCol>
                                </CRow>
                            )}
                            <CRow>
                                <CCol md={6}>
                                    <CFormLabel className="small fw-semibold text-muted">Phí chuyển nhượng mặc định</CFormLabel>
                                    <CFormInput type="number" name="changeFeeDefault" value={form.changeFeeDefault} onChange={handleChange}/>
                                </CCol>
                                <CCol md={6}>
                                    <CFormLabel className="small fw-semibold text-muted">Luật tính giá</CFormLabel>
                                    <CFormSelect name="prorationRule" value={form.prorationRule} onChange={handleChange}>
                                        <option>Standard</option>
                                        <option>Prorated</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </div>

            </div>

        </CForm>
    </div>
  )
}

export default PackageForm