import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect
} from "@coreui/react"

import { useState, useEffect } from "react"
import { getBranches } from "../../services/branchService"

function EditPromotionModal({
  visible,
  setVisible,
  promotion,
  onUpdate
}) {

  const [form, setForm] = useState({})
  const [branches, setBranches] = useState([])

  const formatDateInput = (date) => {
    if (!date) return ""
    return date.split("T")[0]
  }

  // load branches
  useEffect(() => {

    const loadBranches = async () => {

      try {

        const data = await getBranches()

        setBranches(data)

      } catch (err) {

        console.error("Load branches failed:", err)

      }

    }

    loadBranches()

  }, [])

  // load promotion into form
  useEffect(() => {

    if (promotion) {

      setForm({

        id: promotion.id,

        name: promotion.name || "",
        code: promotion.code || "",

        discountType: promotion.discountType || "Percentage",
        discountValue: promotion.discountValue || "",

        contractType: promotion.contractType || "NewContract",

        applicableBranchId:
          promotion.applicableBranchId || "",

        startDate: formatDateInput(promotion.startDate),
        endDate: formatDateInput(promotion.endDate),

        maxUsage: promotion.maxUsage || ""

      })

    }

  }, [promotion])

  if (!promotion) return null

  const handleChange = (e) => {

    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))

  }

  const handleSave = () => {

    const payload = {

      name: form.name,
      code: form.code,

      discountType: form.discountType === "Percentage" ? 0 : 1,

      discountValue: Number(form.discountValue),

      applicablePackageId: null,

      applicableBranchId:
        form.applicableBranchId || null,

      contractType:
        form.contractType === "NewContract"
          ? 0
          : form.contractType === "Renewal"
          ? 1
          : 2,

      startDate: form.startDate,
      endDate: form.endDate,

      maxUsage: Number(form.maxUsage)

    }

    onUpdate(form.id, payload)

    setVisible(false)

  }

  return (

    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
      backdrop="static"
    >

      <CModalHeader closeButton>
        <CModalTitle>
          Chỉnh sửa khuyến mãi
        </CModalTitle>
      </CModalHeader>

      <CModalBody>

        {/* PROMOTION INFO */}

        <h6 className="fw-bold mb-3">
          Thông tin khuyến mãi
        </h6>

        <div className="row">

          {/* LEFT */}

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

          {/* RIGHT */}

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

        {/* SYSTEM INFO */}

        <hr className="my-4" />

        <h6 className="fw-bold mb-3">
          Thông tin hệ thống
        </h6>

        <div className="row">

          <div className="col-md-6">

            <CFormInput
              label="Trạng thái"
              value={promotion.status}
              disabled
              className="mb-3"
            />

            <CFormInput
              label="Đã sử dụng"
              value={`${promotion.currentUsage || 0} / ${promotion.maxUsage || 0}`}
              disabled
              className="mb-3"
            />

          </div>

          <div className="col-md-6">

            <CFormInput
              label="Tạo bởi"
              value={promotion.createdByName || ""}
              disabled
              className="mb-3"
            />

            <CFormInput
              label="Ngày tạo"
              value={
                promotion.createdAt
                  ? new Date(promotion.createdAt).toLocaleString()
                  : ""
              }
              disabled
              className="mb-3"
            />

            <CFormInput
              label="Cập nhật lần cuối"
              value={
                promotion.updatedAt
                  ? new Date(promotion.updatedAt).toLocaleString()
                  : "Chưa cập nhật"
              }
              disabled
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
          onClick={handleSave}
        >
          Lưu thay đổi
        </CButton>

      </CModalFooter>

    </CModal>

  )

}

export default EditPromotionModal
