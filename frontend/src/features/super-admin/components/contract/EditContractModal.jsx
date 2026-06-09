import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CSpinner
} from "@coreui/react"
import { useEffect, useState } from "react"
import { getContractById, updateContract } from "../../services/contractService"
import moment from "moment"

function EditContractModal({ visible, onClose, contractId, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    memberName: "",
    packageName: "",
    status: "",
    startDate: "",
    note: ""
  })

  useEffect(() => {
    if (visible && contractId) {
      loadContract()
    }
  }, [visible, contractId])

  const loadContract = async () => {
    setLoading(true)
    try {
      const data = await getContractById(contractId)
      if (data) {
        setFormData({
          memberName: data.memberName || "",
          packageName: data.packageName || "",
          status: data.status || "",
          // Format to YYYY-MM-DD for date input
          startDate: data.startDate ? moment(data.startDate).format("YYYY-MM-DD") : "",
          note: data.note || ""
        })
      }
    } catch (err) {
      console.error("Failed to load contract in EditModal:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setSubmitting(true)
    try {
      // API expects ISO string format for startDate
      const payload = {
        startDate: formData.startDate ? moment(formData.startDate).toISOString() : null,
        note: formData.note
      }
      await updateContract(contractId, payload)
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      console.error("Failed to update contract:", err)
      alert("Cập nhật hợp đồng thất bại. Vui lòng kiểm tra lại.")
    } finally {
      setSubmitting(false)
    }
  }

  const isPending = formData.status === "Pending"

  return (
    <CModal visible={visible} onClose={onClose} backdrop="static" alignment="center">
      <CForm onSubmit={handleSubmit}>
        <CModalHeader closeButton className="border-0 pb-0">
          <CModalTitle className="fw-bold fs-5 text-dark">Chỉnh Sửa Hợp Đồng</CModalTitle>
        </CModalHeader>

        <CModalBody className="py-3">
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="warning" />
              <div className="mt-2 text-muted">Đang tải thông tin hợp đồng...</div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              <div>
                <CFormLabel className="text-muted small fw-semibold">Hội viên</CFormLabel>
                <CFormInput value={formData.memberName} disabled />
              </div>

              <div>
                <CFormLabel className="text-muted small fw-semibold">Gói tập</CFormLabel>
                <CFormInput value={formData.packageName} disabled />
              </div>

              <div>
                <CFormLabel className="text-muted small fw-semibold">
                  Ngày bắt đầu {!isPending && <span className="text-danger small">(Chỉ được sửa khi Chờ xử lý)</span>}
                </CFormLabel>
                <CFormInput
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  disabled={!isPending}
                />
              </div>

              <div>
                <CFormLabel className="text-muted small fw-semibold">Ghi chú</CFormLabel>
                <CFormTextarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Nhập ghi chú hợp đồng..."
                />
              </div>
            </div>
          )}
        </CModalBody>

        <CModalFooter className="border-0">
          <CButton
            type="button"
            color="secondary"
            variant="outline"
            onClick={onClose}
            className="px-4 fw-bold"
            disabled={submitting}
          >
            Hủy
          </CButton>
          <CButton
            type="submit"
            color="warning"
            className="px-4 fw-bold text-white shadow-sm"
            disabled={loading || submitting}
          >
            {submitting ? "Đang lưu..." : "Lưu Thay Đổi"}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default EditContractModal
