function Streams(){

  const streams = [
    {
      name: "React Tutorial",
      category: "Programming",
      viewers: 120
    },
    {
      name: "Python Basics",
      category: "Programming",
      viewers: 200
    },
    {
      name: "AI Workshop",
      category: "Artificial Intelligence",
      viewers: 350
    }
  ];


  return(

    <div className="container mt-5">

      <h2 className="fw-bold mb-4">
        All Streams
      </h2>


      <div className="row">

        {
          streams.map((stream,index)=>(

            <div 
              className="col-md-4 mb-4"
              key={index}
            >

              <div className="card shadow p-4">

                <h5>
                  🎥 {stream.name}
                </h5>

                <p>
                  Category: {stream.category}
                </p>

                <p>
                  Viewers: {stream.viewers}
                </p>


                <button className="btn btn-primary">
                  Watch Now
                </button>


              </div>

            </div>

          ))
        }

      </div>

    </div>

  )

}


export default Streams;