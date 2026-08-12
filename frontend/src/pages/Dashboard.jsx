import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateStream from "../components/CreateStream";
import Navbar from "../components/Navbar";


import {
    deleteStream,
    getStreams,
} from "../services/streamService";

import { getStats } from "../services/statsService";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


import "../styles/Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [streams, setStreams] = useState([]);
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }
        loadStreams();
        loadStats();
    }, [navigate]);

    const loadStreams = async () => {

        try {

            const response = await getStreams();

            setStreams(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to load streams");

        }

    };
    const loadStats = async () => {

    try {

        const response = await getStats();
        

        setStats(response.data);

    } catch (error) {

        console.log("Unable to load stats:", error);

    }

};

    const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this stream?"
    );

    if (!confirmDelete) return;

    try {

        await deleteStream(id);

        alert("Stream deleted successfully!");

        loadStreams();

    } catch (error) {

        console.log(error);

        if (error.response) {
        alert(error.response.data.detail);
    } else {
        alert("Unable to connect to server.");
    }


    }

};

    return (

        <>
            <Navbar />

            <div className="dashboard">

                <h1 className="title">
                    StreamForge Dashboard
                </h1>

                {/* Create Stream Form */}
                <CreateStream loadStreams={loadStreams} />
                <div className="stats-section">
    <h2>Stream Statistics</h2>
    {stats.length > 0 && (
    <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
            <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    dataKey="window_id"
                    tick={{ fill: "white" }}
                />

                <YAxis
                    tick={{ fill: "white" }}
                />

                <Tooltip />

                <Bar
                    dataKey="total_events"
                    fill="#00bfff"
                />
            </BarChart>
        </ResponsiveContainer>
    </div>
)}

    {stats.length === 0 ? (
        <p>No statistics available</p>
    ) : (
        <div className="stats-grid">
            {stats.map((stat, index) => (
                <div className="stat-card" key={index}>
                    <h3>Owner {stat.owner_id}</h3>

                    <p>
                        <strong>Window:</strong> {stat.window_id}
                    </p>

                    <p>
                        <strong>Total Events:</strong>{" "}
                        {stat.total_events}
                    </p>
                </div>
            ))}
        </div>
    )}
</div>

                {streams.length === 0 ? (

                    <h4 style={{ color: "white" }}>
                        No Streams Available
                    </h4>

                ) : (

                    streams.map((stream) => (

                        <div
                            className="stream-card"
                            key={stream.id}
                        >

                            <h3>{stream.title}</h3>

                            <p>{stream.description}</p>

                            <div className="buttons">

                                <button
                                    className="btn btn-warning"
                                    onClick={() =>
                                        navigate(`/edit-stream/${stream.id}`)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(stream.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </>

    );

}

export default Dashboard;