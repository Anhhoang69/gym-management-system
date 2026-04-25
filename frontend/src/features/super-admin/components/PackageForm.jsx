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

function PackageForm({ initialData = {}, onSubmit, onClose }) {

  const [form, setForm] = useState({

    name: initialData.name || "",
    description: initialData.description || "",

    tier: initialData.tier || "Basic",

    thumbnailUrl: initialData.thumbnailUrl || "",
    badgeLabel: initialData.badgeLabel || "",
    displayOrder: initialData.displayOrder || 0,

    maxCheckinsPerWeek: initialData.maxCheckinsPerWeek || 7,

    isPtIncluded: initialData.isPtIncluded || false,
    privatePtLimit: initialData.privatePtLimit || 0,
    groupPtLimit: initialData.groupPtLimit || 0,

    features: initialData.features || [],
    pricings: initialData.pricings || [],

    changeFeeDefault: initialData.policy?.changeFeeDefault || "",
    prorationRule: initialData.policy?.prorationRule || "Standard",
    upgradeAllowed: initialData.policy?.upgradeAllowed || false,
    downgradeAllowed: initialData.policy?.downgradeAllowed || false,
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
      features: [
        ...form.features,
        {
          packageFeatureId: null,
          content: "",
          displayOrder: form.features.length + 1
        }
      ]
    })

  }

  const updateFeature = (index, value) => {

    const updated = [...form.features]
    updated[index].content = value

    setForm({
      ...form,
      features: updated
    })

  }

  const removeFeature = (index) => {

    const updated = form.features.filter((_, i) => i !== index)

    setForm({
      ...form,
      features: updated
    })

  }

  /* PRICING */

  const addPricing = () => {

    setForm({
      ...form,
      pricings: [
        ...form.pricings,
        {
          packagePricingId: null,
          durationMonths: 1,
          price: 0,
          originalPrice: 0
        }
      ]
    })

  }

  const updatePricing = (index, field, value) => {

    const updated = [...form.pricings]

    updated[index][field] = value

    setForm({
      ...form,
      pricings: updated
    })

  }

  const removePricing = (index) => {

    const updated = form.pricings.filter((_, i) => i !== index)

    setForm({
      ...form,
      pricings: updated
    })

  }

  const handleSubmit = (e) => {

    e.preventDefault()

    const tierMap = {
      Basic: 0,
      Premium: 1,
      Elite: 2
    }

    const prorationMap = {
      Standard: 0,
      Prorated: 1
    }

    const payload = {

      name: form.name,
      description: form.description,
      thumbnailUrl: form.thumbnailUrl,

      tier: tierMap[form.tier],

      isPtIncluded: form.isPtIncluded,

      privatePtLimit: Number(form.privatePtLimit),
      groupPtLimit: Number(form.groupPtLimit),

      maxCheckinsPerWeek: Number(form.maxCheckinsPerWeek),

      badgeLabel: form.badgeLabel,
      displayOrder: Number(form.displayOrder),

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
        upgradeAllowed: form.upgradeAllowed,
        downgradeAllowed: form.downgradeAllowed,
        freezeAllowed: form.freezeAllowed,
        maxFreezeDays: Number(form.maxFreezeDays),
        freezeFee: Number(form.freezeFee)
      }

    }

    onSubmit(payload)

  }

  return (

    <CCard className="border-0 shadow-sm">

      <CCardBody>

        <CForm onSubmit={handleSubmit}>

          <h5 className="fw-bold mb-3">Thông tin gói</h5>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormLabel>Tên gói</CFormLabel>
              <CFormInput name="name" value={form.name} onChange={handleChange}/>
            </CCol>

            <CCol md={6}>
              <CFormLabel>Tier</CFormLabel>
              <CFormSelect name="tier" value={form.tier} onChange={handleChange}>
                <option>Basic</option>
                <option>Premium</option>
                <option>Elite</option>
              </CFormSelect>
            </CCol>

          </CRow>

          <CRow className="mb-3">

            <CCol md={12}>
              <CFormLabel>Mô tả</CFormLabel>
              <CFormInput name="description" value={form.description} onChange={handleChange}/>
            </CCol>

          </CRow>

          <h5 className="fw-bold mt-4 mb-3">Features</h5>

          {form.features.map((f, i) => (

            <div key={i} className="d-flex gap-2 mb-2">

              <input
                className="form-control"
                value={f.content}
                onChange={(e)=>updateFeature(i,e.target.value)}
              />

              <button
                type="button"
                className="btn btn-danger"
                onClick={()=>removeFeature(i)}
              >
                X
              </button>

            </div>

          ))}

          <CButton
            type="button"
            color="warning"
            size="sm"
            onClick={addFeature}
            className="mb-4"
          >
            + Thêm Feature
          </CButton>

          <h5 className="fw-bold mb-3">Pricing</h5>

          {form.pricings.map((p,i)=>(
            <CRow key={i} className="mb-2">

              <CCol md={3}>
                <CFormInput
                  type="number"
                  label="Months"
                  value={p.durationMonths}
                  onChange={(e)=>updatePricing(i,"durationMonths",e.target.value)}
                />
              </CCol>

              <CCol md={4}>
                <CFormInput
                  type="number"
                  label="Price"
                  value={p.price}
                  onChange={(e)=>updatePricing(i,"price",e.target.value)}
                />
              </CCol>

              <CCol md={4}>
                <CFormInput
                  type="number"
                  label="Original"
                  value={p.originalPrice}
                  onChange={(e)=>updatePricing(i,"originalPrice",e.target.value)}
                />
              </CCol>

              <CCol md={1} className="d-flex align-items-end">

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={()=>removePricing(i)}
                >
                  X
                </button>

              </CCol>

            </CRow>
          ))}

          <CButton
            type="button"
            color="warning"
            size="sm"
            onClick={addPricing}
            className="mb-4"
          >
            + Thêm Pricing
          </CButton>

          <h5 className="fw-bold mb-3">Policy</h5>

          <CRow className="mb-3">

            <CCol md={6}>
              <CFormInput
                label="Freeze fee"
                type="number"
                name="freezeFee"
                value={form.freezeFee}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                label="Change fee"
                type="number"
                name="changeFeeDefault"
                value={form.changeFeeDefault}
                onChange={handleChange}
              />
            </CCol>

          </CRow>

          <div className="d-flex gap-2">

            <CButton type="submit" color="warning">
              Lưu gói
            </CButton>

            <CButton color="secondary" onClick={onClose}>
              Hủy
            </CButton>

          </div>

        </CForm>

      </CCardBody>

    </CCard>

  )

}

export default PackageForm