import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol
} from "@coreui/react"

import { useState, useEffect } from "react"

function EditUserModal({ visible, setVisible, user, onUpdate }) {

  const [form,setForm]=useState({})

  const [avatarPreview,setAvatarPreview]=useState(null)

  useEffect(()=>{

    if(user){

      setForm(user)

      setAvatarPreview(user.avatar_url)

    }

  },[user])

  const handleChange=(e)=>{

    setForm({
      ...form,
      [e.target.name]:e.target.value
    })

  }

  const handleAvatar=(e)=>{

    const file=e.target.files[0]

    if(file){

      const url=URL.createObjectURL(file)

      setAvatarPreview(url)

      setForm({
        ...form,
        avatar_url:url
      })

    }

  }

  const handleSubmit=()=>{

    onUpdate(form)

    setVisible(false)

  }

  if(!user) return null

  return(

  <CModal
   visible={visible}
   onClose={()=>setVisible(false)}
   size="lg"
  >

   <CModalHeader>

    <CModalTitle>

     Chỉnh sửa người dùng

    </CModalTitle>

   </CModalHeader>

   <CModalBody>

    {/* Avatar + basic */}

    <div className="d-flex align-items-center gap-4 mb-4">

      <div style={{position:"relative"}}>

        <img
         src={avatarPreview || "https://i.pravatar.cc/100"}
         style={{
          width:80,
          height:80,
          borderRadius:"50%",
          objectFit:"cover"
         }}
        />

        <input
         type="file"
         style={{
          position:"absolute",
          inset:0,
          opacity:0,
          cursor:"pointer"
         }}
         onChange={handleAvatar}
        />

      </div>

      <div>

        <div className="fw-bold fs-5">

         {form.name}

        </div>

        <div className="text-muted">

         {form.email}

        </div>

      </div>

    </div>

    {/* Form */}

    <CRow className="g-3">

      <CCol md={6}>

        <CFormInput
         label="Họ và tên"
         name="name"
         value={form.name || ""}
         onChange={handleChange}
        />

      </CCol>

      <CCol md={6}>

        <CFormInput
         label="Email"
         name="email"
         value={form.email || ""}
         onChange={handleChange}
        />

      </CCol>

      <CCol md={6}>

        <CFormInput
         label="Số điện thoại"
         name="phone"
         value={form.phone || ""}
         onChange={handleChange}
        />

      </CCol>

      <CCol md={6}>

        <CFormSelect
         label="Giới tính"
         name="gender"
         value={form.gender || ""}
         onChange={handleChange}
        >

         <option value="">Chọn</option>
         <option value="male">Nam</option>
         <option value="female">Nữ</option>

        </CFormSelect>

      </CCol>

      <CCol md={6}>

        <CFormInput
         type="date"
         label="Ngày sinh"
         name="birthday"
         value={form.birthday || ""}
         onChange={handleChange}
        />

      </CCol>

      <CCol md={6}>

        <CFormSelect
         label="Trạng thái"
         name="status"
         value={form.status || ""}
         onChange={handleChange}
        >

         <option value="active">Hoạt động</option>
         <option value="pending">Chờ duyệt</option>
         <option value="suspended">Tạm ngưng</option>

        </CFormSelect>

      </CCol>

      <CCol md={12}>

        <CFormInput
         label="Địa chỉ"
         name="address"
         value={form.address || ""}
         onChange={handleChange}
        />

      </CCol>

    </CRow>

    {/* Metadata */}

    <div className="mt-4 text-muted small">

      <div>

       Tạo lúc: {form.created_at || "-"}

      </div>

      <div>

       Đăng nhập gần nhất: {form.last_login_at || "-"}

      </div>

    </div>

   </CModalBody>

   <CModalFooter>

    <CButton
     color="secondary"
     onClick={()=>setVisible(false)}
    >

     Hủy

    </CButton>

    <CButton
     color="warning"
     onClick={handleSubmit}
    >

     Lưu thay đổi

    </CButton>

   </CModalFooter>

  </CModal>

 )

}

export default EditUserModal