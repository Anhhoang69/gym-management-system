import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CAlert
} from "@coreui/react"

import { useState, useEffect } from "react"
import { validatePromotion } from "../../services/promotionService"

function CreatePromotionModal({
  visible,
  setVisible,
  onCreate,
  branches = [],
  fixedBranchId = ""
}) {

  const [validationErrors, setValidationErrors] = useState([])
  const [validationWarnings, setValidationWarnings] = useState([])

  const [form, setForm] = useState({

    name: "",
    code: "",

    discountType: "Percentage",
    discountValue: "",

    contractType: "NewContract",
    applicableBranchId: fixedBranchId || "",

    startDate: "",
    endDate: "",

    maxUsage: ""

  })

  useEffect(() => {
    if (visible) {
      setValidationErrors([])
      setValidationWarnings([])
      setForm({
        name: "",
        code: "",
        discountType: "Percentage",
        discountValue: "",
        contractType: "NewContract",
        applicableBranchId: fixedBranchId || "",
        startDate: "",
        endDate: "",
        maxUsage: ""
      })
    }
  }, [visible, fixedBranchId])

  const handleChange = (e) => {

    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })

  }

  const handleCreate = async () => {
    setValidationErrors([])
    setValidationWarnings([])

    const payload = {
      name: form.name,
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      applicablePackageId: null,
      applicableBranchId: form.applicableBranchId || null,
      contractType: form.contractType || null,
      startDate: form.startDate ? `${form.startDate}T00:00:00Z` : null,
      endDate: form.endDate ? `${form.endDate}T23:59:59Z` : null,
      maxUsage: Number(form.maxUsage),
      minContractValue: 0,
      applicationRule: "BestDiscount",
      priority: 10
    }

    try {
      const check = await validatePromotion({
        code: payload.code,
        discountType: payload.discountType,
        discountValue: payload.discountValue,
        startDate: payload.startDate,
        endDate: payload.endDate,
        applicableBranchId: payload.applicableBranchId
      })

      if (!check.isValid) {
        setValidationErrors(check.errors || ["Thông tin khuyến mãi không hợp lệ"])
        setValidationWarnings(check.warnings || [])
        return
      }

      await onCreate(payload)
      setVisible(false)
      setForm({
        name: "",
        code: "",
        discountType: "Percentage",
        discountValue: "",
        contractType: "NewContract",
        applicableBranchId: fixedBranchId || "",
        startDate: "",
        endDate: "",
        maxUsage: ""
      })
    } catch (err) {
      console.error("Validation/Creation failed:", err)
      const errorMsg = err.response?.data?.errors || err.response?.data?.message || err.message || "Lỗi hệ thống khi tạo khuyến mãi"
      setValidationErrors(Array.isArray(errorMsg) ? errorMsg : [errorMsg])
    }

  }

  return (

    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
    >

      <CModalHeader>
        <CModalTitle>
          Tạo khuyến mãi mới
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        {validationErrors.length > 0 && (
          <CAlert color="danger" className="mb-3">
            <ul className="mb-0">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </CAlert>
        )}
        {validationWarnings.length > 0 && (
          <CAlert color="warning" className="mb-3">
            <ul className="mb-0">
              {validationWarnings.map((warn, idx) => (
                <li key={idx}>{warn}</li>
              ))}
            </ul>
          </CAlert>
        )}

        <div className="row">

          {/* LEFT COLUMN */}

          <div className="col-md-6">

            <CFormInput
              label="Tên khuyến mãi"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mb-3"
            />

            <CFormInput
              label="Mã khuyến mãi"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="mb-3"
            />

            <CFormSelect
              label="Loại giảm giá"
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="mb-3"
            >
              <option value="Percentage">
                Percentage (%)
              </option>

              <option value="FixedAmount">
                Fixed Amount ($)
              </option>
            </CFormSelect>

            <CFormInput
              label="Giá trị giảm"
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              className="mb-3"
            />

          </div>

          {/* RIGHT COLUMN */}

          <div className="col-md-6">

            <CFormSelect
              label="Áp dụng cho hợp đồng"
              name="contractType"
              value={form.contractType}
              onChange={handleChange}
              className="mb-3"
            >

              <option value="NewContract">
                New Contract
              </option>

              <option value="Renewal">
                Renewal
              </option>

              <option value="Upgrade">
                Upgrade
              </option>

            </CFormSelect>

            <CFormSelect
              label="Chi nhánh áp dụng"
              name="applicableBranchId"
              value={form.applicableBranchId}
              onChange={handleChange}
              className="mb-3"
              disabled={!!fixedBranchId}
            >

              <option value="">
                Tất cả chi nhánh
              </option>

              {branches.map(b => (
                <option
                  key={b.branchId}
                  value={b.branchId}
                >
                  {b.name}
                </option>
              ))}

            </CFormSelect>

            <div className="row">

              <div className="col-md-6">

                <CFormInput
                  type="date"
                  label="Ngày bắt đầu"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="mb-3"
                />

              </div>

              <div className="col-md-6">

                <CFormInput
                  type="date"
                  label="Ngày kết thúc"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="mb-3"
                />

              </div>

            </div>

            <CFormInput
              type="number"
              label="Số lượt sử dụng tối đa"
              name="maxUsage"
              value={form.maxUsage}
              onChange={handleChange}
            />

          </div>

        </div>

      </CModalBody>

      <CModalFooter>

        <CButton
          color="secondary"
          onClick={() => setVisible(false)}
        >
          Hủy
        </CButton>

        <CButton
          color="warning"
          onClick={handleCreate}
        >
          Tạo khuyến mãi
        </CButton>

      </CModalFooter>

    </CModal>

  )

}

export default CreatePromotionModal