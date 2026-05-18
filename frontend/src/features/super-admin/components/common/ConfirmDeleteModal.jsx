import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from "@coreui/react"

function ConfirmDeleteModal({
  visible,
  setVisible,
  onConfirm,
  itemName
}) {

  const handleClose = () => {
    setVisible(false)
  }

  return (

    <CModal
      visible={visible}
      onClose={handleClose}
      backdrop="static"
      alignment="center"
    >

      <CModalHeader closeButton>
        <CModalTitle className="fw-bold">
          Xác nhận xoá
        </CModalTitle>
      </CModalHeader>

      <CModalBody>

        <div className="text-center px-3">

          {/* icon warning */}

          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#FEE2E2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              fontSize: 28
            }}
          >
            ⚠️
          </div>

          <p className="mb-2 text-muted">
            Bạn có chắc muốn xoá:
          </p>

          <h5 className="fw-bold mb-3">
            {itemName}
          </h5>

          <p
            className="mb-0"
            style={{
              color: "#EF4444",
              fontSize: 14
            }}
          >
            Hành động này không thể hoàn tác.
          </p>

        </div>

      </CModalBody>

      <CModalFooter
        className="d-flex justify-content-center gap-2"
      >

        <CButton
          color="secondary"
          variant="outline"
          onClick={handleClose}
          style={{
            minWidth: 110
          }}
        >
          Huỷ
        </CButton>

        <CButton
          color="danger"
          onClick={onConfirm}
          style={{
            minWidth: 110
          }}
        >
          Xoá
        </CButton>

      </CModalFooter>

    </CModal>

  )

}

export default ConfirmDeleteModal