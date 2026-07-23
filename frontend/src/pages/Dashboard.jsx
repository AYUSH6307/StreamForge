import DashboardCard from "../components/DashboardCard";
import StreamCard from "../components/StreamCard";


function Dashboard() {


  const streams = [
    {
      name:"React Tutorial",
      category:"Programming"
    },
    {
      name:"Python Basics",
      category:"Programming"
    },
    {
      name:"AI Workshop",
      category:"Artificial Intelligence"
    }
  ];


  return (

    <div className="container mt-5">


      <h2 className="fw-bold mb-4">
        Dashboard
      </h2>


      <div className="row">

        <DashboardCard 
          title="Total Streams"
          value="120"
        />


        <DashboardCard 
          title="Active Users"
          value="350"
        />


        <DashboardCard 
          title="Revenue"
          value="₹25,000"
        />

      </div>


      <hr />


      <h3 className="mt-4">
        Recent Streams
      </h3>


      {
        streams.map((stream,index)=>(

          <StreamCard
            key={index}
            name={stream.name}
            category={stream.category}
          />

        ))
      }


    </div>

  );

}


export default Dashboard;