export default function TaskCard({task,done,toggle}){

return(

<div className={`card shadow-sm ${done ? "border-success" : ""}`}>

<div className="card-body">

<div className="form-check">

<input
type="checkbox"
className="form-check-input"
checked={done}
onChange={toggle}
/>

<label className="form-check-label">

{task}

</label>

</div>

</div>

</div>

)

}