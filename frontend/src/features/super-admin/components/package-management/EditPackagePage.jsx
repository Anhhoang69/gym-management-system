import { useLocation } from "react-router-dom"
import PackageForm from "../components/PackageForm"

function EditPackagePage() {

  const location = useLocation()

  const packageData = location.state?.pkg

  const handleUpdate = (data) => {
    console.log("UPDATE PACKAGE", data)
  }

  if (!packageData) {
    return <p>Package not found</p>
  }

  return (
    <div>

      <h3 className="fw-bold mb-4">
        Chỉnh Sửa Gói Tập
      </h3>

      <PackageForm
        initialData={packageData}
        onSubmit={handleUpdate}
      />

    </div>
  )
}

export default EditPackagePage