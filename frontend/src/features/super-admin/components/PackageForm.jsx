import { useState } from "react"
import {
  CCard,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton
} from "@coreui/react"

function PackageForm({ initialData = {}, onSubmit }) {

  const [form, setForm] = useState({
    name: initialData.name || "",
    duration: initialData.duration || "",
    sessions: initialData.sessions || "",
    base_price: initialData.base_price || "",
    status: initialData.status || "active",
    is_PT_included: initialData.is_PT_included || false,

    freeze_allowed: initialData.freeze_allowed || false,
    max_freeze_days: initialData.max_freeze_days || "",
    freeze_fee: initialData.freeze_fee || "",
    upgrade_allowed: initialData.upgrade_allowed || false,
    downgrade_allowed: initialData.downgrade_allowed || false,
    change_fee_default: initialData.change_fee_default || "",
    proration_rule: initialData.proration_rule || ""
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const packageData = {
      name: form.name,
      duration: form.duration,
      sessions: form.sessions,
      base_price: form.base_price,
      status: form.status,
      is_PT_included: form.is_PT_included
    }

    const policyData = {
      freeze_allowed: form.freeze_allowed,
      max_freeze_days: form.max_freeze_days,
      freeze_fee: form.freeze_fee,
      upgrade_allowed: form.upgrade_allowed,
      downgrade_allowed: form.downgrade_allowed,
      change_fee_default: form.change_fee_default,
      proration_rule: form.proration_rule
    }

    onSubmit({
      package: packageData,
      policy: policyData
    })
  }

  return (
    <CCard className="border-0 shadow-sm">
      <CCardBody>

        <CForm onSubmit={handleSubmit}>

          {/* ===== THÔNG TIN GÓI ===== */}

          <h5 className="fw-bold mb-3">
            Thông Tin Gói Tập
          </h5>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormLabel>Tên gói</CFormLabel>
              <CFormInput
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ví dụ: Gói Premium 12 tháng"
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Thời hạn (tháng)</CFormLabel>
              <CFormInput
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
              />
            </CCol>

          </CRow>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormLabel>Số buổi tập</CFormLabel>
              <CFormInput
                type="number"
                name="sessions"
                value={form.sessions}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Giá cơ bản ($)</CFormLabel>
              <CFormInput
                type="number"
                name="base_price"
                value={form.base_price}
                onChange={handleChange}
              />
            </CCol>

          </CRow>

          <CRow className="mb-4">

            <CCol md={6}>
              <CFormLabel>Trạng thái</CFormLabel>
              <CFormSelect
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng bán</option>
              </CFormSelect>
            </CCol>

            <CCol md={6} className="d-flex align-items-end">
              <CFormCheck
                label="Bao gồm PT cá nhân"
                name="is_PT_included"
                checked={form.is_PT_included}
                onChange={handleChange}
              />
            </CCol>

          </CRow>


          {/* ===== CHÍNH SÁCH GÓI ===== */}

          <h5 className="fw-bold mb-3">
            Chính Sách Gói
          </h5>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormCheck
                label="Cho phép đóng băng gói"
                name="freeze_allowed"
                checked={form.freeze_allowed}
                onChange={handleChange}
              />
            </CCol>

          </CRow>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormLabel>Số ngày đóng băng tối đa</CFormLabel>
              <CFormInput
                type="number"
                name="max_freeze_days"
                value={form.max_freeze_days}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel>Phí đóng băng ($)</CFormLabel>
              <CFormInput
                type="number"
                name="freeze_fee"
                value={form.freeze_fee}
                onChange={handleChange}
              />
            </CCol>

          </CRow>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormCheck
                label="Cho phép nâng cấp gói"
                name="upgrade_allowed"
                checked={form.upgrade_allowed}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormCheck
                label="Cho phép hạ cấp gói"
                name="downgrade_allowed"
                checked={form.downgrade_allowed}
                onChange={handleChange}
              />
            </CCol>

          </CRow>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormLabel>Phí đổi gói mặc định ($)</CFormLabel>
              <CFormInput
                type="number"
                name="change_fee_default"
                value={form.change_fee_default}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Quy tắc tính phí (Proration)</CFormLabel>
              <CFormInput
                name="proration_rule"
                value={form.proration_rule}
                onChange={handleChange}
                placeholder="Ví dụ: prorated / full charge"
              />
            </CCol>
          </CRow>


          {/* ACTIONS */}

          <div className="d-flex gap-2">

            <CButton type="submit" color="warning">
              Lưu gói tập
            </CButton>

            <CButton color="secondary">
              Hủy
            </CButton>

          </div>

        </CForm>

      </CCardBody>
    </CCard>
  )
}

export default PackageForm