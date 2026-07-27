function StreamCard({name, category}) {

  return (

    <div className="card p-3 mb-3 shadow w-100">

      <h5>🎥 {name}</h5>

      <p>
        Category: {category}
      </p>

    </div>

  );

}

export default StreamCard;