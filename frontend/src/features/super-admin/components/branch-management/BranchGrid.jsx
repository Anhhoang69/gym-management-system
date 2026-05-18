import BranchCard from "./BranchCard"

function BranchGrid({ branches,onViewDetail }) {

  return (

    <div className="row g-4">

      {branches.map((branch) => (

        <div className="col-md-6" key={branch.id}>

          <BranchCard
            branch={branch}
            onViewDetail={onViewDetail}
          />

        </div>

      ))}

    </div>

  )

}

export default BranchGrid