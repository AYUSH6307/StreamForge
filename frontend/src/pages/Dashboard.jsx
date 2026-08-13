import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CreateStream from "../components/CreateStream";
import Navbar from "../components/Navbar";
import SystemHealth from "../components/SystemHealth";
import GrafanaDashboard from "../components/GrafanaDashboard";

import {
    deleteStream,
    getStreams,
} from "../services/streamService";

import {
    getStats,
    getProcessingStatus,
    getProcessingState,
} from "../services/statsService";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import "../styles/Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [streams, setStreams] = useState([]);
    const [stats, setStats] = useState([]);

    const [processing, setProcessing] = useState({
        status: "offline",
        processed_events: 0,
        last_event: null,
        last_event_time: null,
        last_window_id: null,
        last_window_count: 0,
    });

    const [processingState, setProcessingState] = useState([]);

    const [loadingStats, setLoadingStats] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);


    // =========================
    // LOAD STREAMS
    // =========================

    const loadStreams = useCallback(async () => {

        try {

            const response = await getStreams();

            setStreams(response.data || []);

        } catch (error) {

            console.log(
                "Unable to load streams:",
                error
            );

        }

    }, []);


    // =========================
    // LOAD STATISTICS
    // =========================

    const loadStats = useCallback(async () => {

        try {

            setLoadingStats(true);

            const response = await getStats();

            const data = response.data || [];

            setStats(data);

            setLastUpdated(new Date());

        } catch (error) {

            console.log(
                "Unable to load stats:",
                error
            );

        } finally {

            setLoadingStats(false);

        }

    }, []);


    // =========================
    // LOAD PROCESSING STATUS
    // =========================

    const loadProcessingStatus = useCallback(async () => {

        try {

            const response =
                await getProcessingStatus();

            setProcessing(response.data);

        } catch (error) {

            console.log(
                "Unable to load processing status:",
                error
            );

        }

    }, []);


    // =========================
    // LOAD PROCESSING STATE
    // =========================

    const loadProcessingState = useCallback(async () => {

        try {

            const response =
                await getProcessingState();

            setProcessingState(
                response.data || []
            );

        } catch (error) {

            console.log(
                "Unable to load persistent processing state:",
                error
            );

        }

    }, []);


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;

        }

        loadStreams();
        loadStats();
        loadProcessingStatus();
        loadProcessingState();


        // Refresh processing status
        // every 2 seconds

        const processingInterval =
            setInterval(() => {

                loadProcessingStatus();

            }, 2000);


        // Refresh statistics
        // every 5 seconds

        const statsInterval =
            setInterval(() => {

                loadStats();

            }, 5000);


        return () => {

            clearInterval(
                processingInterval
            );

            clearInterval(
                statsInterval
            );

        };

    }, [
        navigate,
        loadStreams,
        loadStats,
        loadProcessingStatus,
        loadProcessingState
    ]);


    // =========================
    // DELETE STREAM
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this stream?"
            );

        if (!confirmDelete) {

            return;

        }

        try {

            await deleteStream(id);

            alert(
                "Stream deleted successfully!"
            );

            loadStreams();

        } catch (error) {

            console.log(error);

            if (error.response) {

                alert(
                    error.response.data?.detail ||
                    "Unable to delete stream."
                );

            } else {

                alert(
                    "Unable to connect to server."
                );

            }

        }

    };


    // =========================
    // STATISTICS CALCULATIONS
    // =========================

    const totalEvents =
        stats.reduce(
            (total, stat) =>
                total +
                Number(
                    stat.total_events || 0
                ),
            0
        );


    const statisticsWindows =
        stats.length;


    const latestStat =
        stats.length > 0
            ? stats[0]
            : null;


    // =========================
    // RENDER
    // =========================

    return (

        <>

            <Navbar />


            <div className="dashboard">


                {/* ========================= */}
                {/* PAGE TITLE */}
                {/* ========================= */}

                <h1 className="title">
                    StreamForge Dashboard
                </h1>


                {/* ========================= */}
                {/* SYSTEM HEALTH */}
                {/* ========================= */}

                <SystemHealth />
                <GrafanaDashboard/>

                {/* ========================= */}
                {/* CREATE STREAM */}
                {/* ========================= */}

                <CreateStream
                    loadStreams={loadStreams}
                />


                {/* ========================= */}
                {/* LIVE PROCESSING MONITOR */}
                {/* ========================= */}

                <div className="processing-section">

                    <h2>
                        Live Processing Monitor
                    </h2>


                    <div className="processing-grid">


                        {/* PROCESSOR */}

                        <div className="processing-card">

                            <h3>
                                Processor
                            </h3>

                            <p
                                style={{
                                    color:
                                        processing.status ===
                                        "online"
                                            ? "#00ff88"
                                            : "#ff4d4d",

                                    fontWeight:
                                        "bold",
                                }}
                            >

                                {processing.status.toUpperCase()}

                            </p>

                        </div>


                        {/* PROCESSED EVENTS */}

                        <div className="processing-card">

                            <h3>
                                Processed Events
                            </h3>

                            <p>
                                {processing.processed_events}
                            </p>

                        </div>


                        {/* LAST WINDOW */}

                        <div className="processing-card">

                            <h3>
                                Last Window
                            </h3>

                            <p>
                                {processing.last_window_id ??
                                    "N/A"}
                            </p>

                        </div>


                        {/* WINDOW EVENTS */}

                        <div className="processing-card">

                            <h3>
                                Window Events
                            </h3>

                            <p>
                                {processing.last_window_count}
                            </p>

                        </div>

                    </div>


                    {/* LAST EVENT */}

                    <div className="last-event-card">

                        <h3>
                            Last Processed Event
                        </h3>


                        <p>

                            <strong>
                                Event:
                            </strong>{" "}

                            {processing.last_event ??
                                "No events processed yet"}

                        </p>


                        <p>

                            <strong>
                                Time:
                            </strong>{" "}

                            {processing.last_event_time

                                ? new Date(
                                      processing.last_event_time
                                  ).toLocaleString()

                                : "N/A"}

                        </p>

                    </div>

                </div>


                {/* ========================= */}
                {/* DESCRIPTION */}
                {/* ========================= */}

                <p
                    style={{
                        color: "#aaa",
                        marginBottom: "25px"
                    }}
                >
                    Real-time stream processing
                    monitoring
                </p>


                {/* ========================= */}
                {/* SUMMARY CARDS */}
                {/* ========================= */}

                <div className="stats-grid">


                    {/* TOTAL EVENTS */}

                    <div className="stat-card">

                        <h3>
                            Total Events
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                color: "#00bfff"
                            }}
                        >
                            {totalEvents}
                        </p>

                    </div>


                    {/* ACTIVE STREAMS */}

                    <div className="stat-card">

                        <h3>
                            Active Streams
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                color: "#52b788"
                            }}
                        >
                            {streams.length}
                        </p>

                    </div>


                    {/* WINDOWS */}

                    <div className="stat-card">

                        <h3>
                            Statistics Windows
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                color: "#ffb703"
                            }}
                        >
                            {statisticsWindows}
                        </p>

                    </div>


                    {/* LATEST EVENTS */}

                    <div className="stat-card">

                        <h3>
                            Latest Window Events
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "bold",
                                color: "#c77dff"
                            }}
                        >

                            {latestStat
                                ? latestStat.total_events
                                : 0}

                        </p>

                    </div>

                </div>


                {/* ========================= */}
                {/* LAST UPDATED */}
                {/* ========================= */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginTop: "20px",
                        marginBottom: "10px",
                        color: "#aaa"
                    }}
                >

                    <span>
                        Statistics update automatically
                        every 5 seconds.
                    </span>


                    <span>

                        {loadingStats

                            ? "Updating..."

                            : lastUpdated

                                ? `Last updated: ${lastUpdated.toLocaleTimeString()}`

                                : "Waiting for statistics..."

                        }

                    </span>

                </div>


                {/* ========================= */}
                {/* STREAM STATISTICS */}
                {/* ========================= */}

                <div className="stats-section">

                    <h2>
                        Stream Statistics
                    </h2>


                    {stats.length > 0 ? (

                        <div
                            style={{
                                width: "100%",
                                height: 350
                            }}
                        >

                            <ResponsiveContainer>

                                <BarChart
                                    data={stats}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />


                                    <XAxis
                                        dataKey="window_id"
                                        tick={{
                                            fill: "white"
                                        }}
                                    />


                                    <YAxis
                                        tick={{
                                            fill: "white"
                                        }}
                                    />


                                    <Tooltip />


                                    <Bar
                                        dataKey="total_events"
                                        fill="#00bfff"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    ) : (

                        <p>
                            No statistics available yet.
                        </p>

                    )}


                    {/* ========================= */}
                    {/* STATISTICS DETAILS */}
                    {/* ========================= */}

                    {stats.length > 0 && (

                        <div className="stats-grid">

                            {stats.map(
                                (stat, index) => (

                                    <div
                                        className="stat-card"
                                        key={
                                            stat.id ||
                                            index
                                        }
                                    >

                                        <h3>
                                            Owner{" "}
                                            {stat.owner_id}
                                        </h3>


                                        <p>

                                            <strong>
                                                Window:
                                            </strong>{" "}

                                            {stat.window_id}

                                        </p>


                                        <p>

                                            <strong>
                                                Total Events:
                                            </strong>{" "}

                                            {stat.total_events}

                                        </p>


                                        {stat.created_at && (

                                            <p>

                                                <strong>
                                                    Created:
                                                </strong>{" "}

                                                {new Date(
                                                    stat.created_at
                                                ).toLocaleString()}

                                            </p>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* ================================================= */}
                {/* GRAFANA MONITORING                                */}
                {/* ================================================= */}

                <GrafanaDashboard />


                {/* ========================= */}
                {/* YOUR STREAMS */}
                {/* ========================= */}

                <div
                    style={{
                        marginTop: "40px"
                    }}
                >

                    <h2
                        style={{
                            color: "white"
                        }}
                    >
                        Your Streams
                    </h2>


                    {streams.length === 0 ? (

                        <h4
                            style={{
                                color: "white"
                            }}
                        >
                            No Streams Available
                        </h4>

                    ) : (

                        streams.map(
                            (stream) => (

                                <div
                                    className="stream-card"
                                    key={stream.id}
                                >

                                    <h3>
                                        {stream.title}
                                    </h3>


                                    <p>
                                        {stream.description}
                                    </p>


                                    <div className="buttons">


                                        {/* EDIT */}

                                        <button
                                            className="btn btn-warning"
                                            onClick={() =>
                                                navigate(
                                                    `/edit-stream/${stream.id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        {/* DELETE */}

                                        <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                                handleDelete(
                                                    stream.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>

            </div>

        </>

    );

}


export default Dashboard;