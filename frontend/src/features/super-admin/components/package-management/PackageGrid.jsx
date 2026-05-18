import PackageCard from "./PackageCard"

function PackageGrid({ packages, onEdit, onDelete, onToggleStatus }) {

  return (
    <div className="row g-3">

      {packages.map(pkg => (

        <div className="col-md-3" key={pkg.id}>

          <PackageCard
            pkg={pkg}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />

        </div>

      ))}

    </div>
  )

}

export default PackageGrid