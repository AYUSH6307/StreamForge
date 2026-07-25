function DashboardCard({title, value}) {

  return (

    <div className="col-12 col-md-4 mb-4">

      <div className="card shadow border-0 p-4">

        <h5 className="text-secondary">
          {title}
        </h5>

        <h2 className="fw-bold mt-3">
          {value}
        </h2>

      </div>

    </div>

  );

}

export default DashboardCard;