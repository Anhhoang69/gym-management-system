import PackageForm from "../components/PackageForm"

function CreatePackagePage() {

  const handleCreate = (data) => {
    console.log("CREATE PACKAGE", data)
  }

  return (
    <div>

      <h3 className="fw-bold mb-4">
        Tạo Gói Tập
      </h3>

      <PackageForm onSubmit={handleCreate} />

    </div>
  )
}

export default CreatePackagePage