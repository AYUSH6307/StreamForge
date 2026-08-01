import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateStream from "../components/CreateStream";
import Navbar from "../components/Navbar";

import {
    deleteStream,
    getStreams,
} from "../services/streamService";

import "../styles/Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [streams, setStreams] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }
        loadStreams();
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

        alert("Unable to delete stream.");

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