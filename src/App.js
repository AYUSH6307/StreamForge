import React, { useState, useEffect } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const nodes = [
  {
    id: "1",
    position: { x: 50, y: 150 },
    data: { label: "Producer 📤" },
  },

  {
    id: "2",
    position: { x: 300, y: 150 },
    data: { label: "Topic: user-events 📌" },
  },

  {
    id: "3",
    position: { x: 550, y: 50 },
    data: { label: "Broker 1 🖥️" },
  },

  {
    id: "4",
    position: { x: 550, y: 150 },
    data: { label: "Broker 2 🖥️" },
  },

  {
    id: "5",
    position: { x: 550, y: 250 },
    data: { label: "Broker 3 🖥️" },
  },

  {
    id: "6",
    position: { x: 850, y: 150 },
    data: { label: "Consumer Group 👥" },
  },
];


const edges = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    animated: true,
  },

  {
    id: "2-3",
    source: "2",
    target: "3",
    animated: true,
  },

  {
    id: "2-4",
    source: "2",
    target: "4",
    animated: true,
  },

  {
    id: "2-5",
    source: "2",
    target: "5",
    animated: true,
  },

  {
    id: "4-6",
    source: "4",
    target: "6",
    animated: true,
  },
];

const COLORS = ["#38bdf8", "#22c55e", "#f59e0b", "#ef4444"];



function App(){

const [stats, setStats] = useState({
  topics: 0,
  consumers: 0,
  messages: 0,
  throughput: 0,
});
const [throughputData, setThroughputData] = useState([]);
const [lagData, setLagData] = useState([]);
const [topics, setTopics] = useState([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [lastUpdated, setLastUpdated] = useState("");
const pieData = [
  { name: "Topics", value: stats.topics },
  { name: "Consumers", value: stats.consumers },
  { name: "Messages", value: stats.messages },
];
const loadData = () => {
  fetch("http://127.0.0.1:5000/stats")
    .then((res) => res.json())
    .then((data) => setStats(data));

  fetch("http://127.0.0.1:5000/throughput")
    .then((res) => res.json())
    .then((data) => setThroughputData(data));

  fetch("http://127.0.0.1:5000/lag")
    .then((res) => res.json())
    .then((data) => setLagData(data));

  fetch("http://127.0.0.1:5000/topics")
  .then((res) => res.json())
  .then((data) => {
    setTopics(data);
    setLastUpdated(new Date().toLocaleTimeString());
  })
  .finally(() => setLoading(false));
};


useEffect(() => {
  loadData();

  const interval = setInterval(() => {
    loadData();
  }, 5000);

  return () => clearInterval(interval);
}, []);


if(loading){
  return (
    <h2 style={{color:"white", textAlign:"center"}}>
      Loading Dashboard...
    </h2>
  )
}

return(

<div
style={{
background:"#0f172a",
minHeight:"100vh",
padding:"20px",
color:"white"
}}
>


{/* Navbar */}

<div
style={{
background:"#020617",
padding:"20px",
borderRadius:"12px",
marginBottom:"25px"
}}
>

<h1
  style={{
    background: "linear-gradient(90deg,#38bdf8,#22c55e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "36px",
    fontWeight: "bold",
  }}
>
  🚀 StreamForge Dashboard
</h1>

<div style={{color:"#94a3b8"}}>

<span onClick={()=>document.getElementById("home").scrollIntoView()}>
Home
</span>

&nbsp; | &nbsp;

<span onClick={()=>document.getElementById("topics").scrollIntoView()}>
Topics
</span>

&nbsp; | &nbsp;

<span onClick={()=>document.getElementById("brokers").scrollIntoView()}>
Brokers
</span>

&nbsp; | &nbsp;

<span onClick={()=>document.getElementById("monitoring").scrollIntoView()}>
Monitoring
</span>
&nbsp; | &nbsp;

<button
  onClick={loadData}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  🔄 Refresh
</button>

</div>

</div>



{/* Cards */}

<div
id="home"
style={{
display:"flex",
gap:"20px",
flexWrap:"wrap"
}}

>


{[
  ["Kafka Status", "Running"],
  ["Topics", stats.topics],
  ["Brokers", "3"],
  ["Partitions", "24"],
  ["Consumers", stats.consumers],
  ["Messages", stats.messages],
  ["Throughput", stats.throughput],
].map((item, index) => (
  <div
    key={index}
    style={{
      background: "#1e293b",
      padding: "20px",
      width: "200px",
      borderRadius: "12px",
      boxShadow: "0 5px 15px #000",
      transition: "0.3s",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
  e.currentTarget.style.transform = "scale(1.05)";
}}

onMouseLeave={(e) => {
  e.currentTarget.style.transform = "scale(1)";
}}
  >
    <h3>{item[0]}</h3>
    <h2>{item[1]}</h2>
  </div>
))}


</div>



{/* Flow */}

<h2 style={{marginTop:"40px"}}>
Kafka Architecture
</h2>


<div
id="brokers"
style={{
height:"350px",
background:"#1e293b",
borderRadius:"12px"
}}
>

<ReactFlow
nodes={nodes}
edges={edges}
fitView
/>

</div>



{/* Throughput */}

<div
id="monitoring"
style={{
background:"#1e293b",
marginTop:"30px",
padding:"20px",
borderRadius:"12px"
}}
>

<h2>
📊 Message Throughput
</h2>


<ResponsiveContainer width="100%" height={300}>

<LineChart data={throughputData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="messages"
stroke="#38bdf8"
strokeWidth={3}
/>


</LineChart>


</ResponsiveContainer>


</div>




{/* Lag Chart */}


<div
style={{
background:"#1e293b",
marginTop:"30px",
padding:"20px",
borderRadius:"12px"
}}
>


<h2>
📉 Consumer Lag
</h2>


<ResponsiveContainer width="100%" height={300}>


<LineChart data={lagData}>


<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>


<Line
type="monotone"
dataKey="lag"
stroke="#ef4444"
strokeWidth={3}
/>


</LineChart>


</ResponsiveContainer>


</div>


{/* Pie Chart */}

<div
  style={{
    background: "#1e293b",
    marginTop: "30px",
    padding: "20px",
    borderRadius: "12px",
  }}
>
  <h2>📊 Kafka Overview</h2>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {pieData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>


{/* Table */}





<div
id="topics"
style={{
background:"#1e293b",
marginTop:"30px",
padding:"20px",
borderRadius:"12px"
}}
>


<h2>
Kafka Topics Monitoring
</h2>
<input
  type="text"
  placeholder="Search Topic..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "250px",
    padding: "10px",
    marginTop: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  }}
/>


<table
style={{
width:"100%",
borderCollapse:"collapse",
marginTop:"20px"
}}
>

<thead>

<tr style={{background:"#334155"}}>

<th style={{padding:"12px"}}>
Topic
</th>

<th style={{padding:"12px"}}>
Messages
</th>

<th style={{padding:"12px"}}>
Status
</th>

</tr>

</thead>


<tbody>

{topics
  .filter((item) =>
    item.topic.toLowerCase().includes(search.toLowerCase())
  )
  .map((item, index) => (

<tr key={index}
style={{
borderBottom:"1px solid #475569"
}}
>

<td style={{padding:"12px"}}>
{item.topic}
</td>


<td style={{padding:"12px"}}>
{item.messages}
</td>


<td style={{padding:"12px"}}>

<span
style={{
background:"#22c55e",
padding:"5px 12px",
borderRadius:"20px",
color:"white"
}}
>
{item.status}
</span>

</td>


</tr>

))}

</tbody>

</table>


</div>



<h3
style={{
textAlign:"center",
marginTop:"30px",
color:"#94a3b8"
}}
>
<p
  style={{
    textAlign: "center",
    color: "#94a3b8",
    marginTop: "20px",
  }}
>
  Last Updated: {lastUpdated}
</p>
Developed by Ramya 🚀
</h3>



</div>

)

}


export default App;