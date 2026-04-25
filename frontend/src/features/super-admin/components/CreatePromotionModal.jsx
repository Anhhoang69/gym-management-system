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

import { useState } from "react"

function CreatePromotionModal({
  visible,
  setVisible,
  onCreate,
  branches = []
}) {

  const [form, setForm] = useState({

    name: "",
    code: "",

    discountType: "Percentage",
    discountValue: "",

    contractType: "NewContract",
    applicableBranchId: "",

    startDate: "",
    endDate: "",

    maxUsage: ""

  })

  const handleChange = (e) => {

    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value
    })

  }

  const handleCreate = () => {

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      maxUsage: Number(form.maxUsage)
    }

    onCreate(payload)

    setVisible(false)

    setForm({
      name: "",
      code: "",
      discountType: "Percentage",
      discountValue: "",
      contractType: "NewContract",
      applicableBranchId: "",
      startDate: "",
      endDate: "",
      maxUsage: ""
    })

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