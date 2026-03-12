import TrainerCard from "./TrainerCard"

function TrainerGrid({ trainers = [] }) {

  return (
    <div className="row g-4">

      {trainers.map((trainer) => (
        <div className="col-md-3" key={trainer.id}>
          <TrainerCard trainer={trainer} />
        </div>
      ))}

    </div>
  )
}

export default TrainerGrid