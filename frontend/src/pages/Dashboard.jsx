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

    const [activeSection, setActiveSection] =
        useState("overview");

    const [streams, setStreams] = useState([]);
    const [stats, setStats] = useState([]);

    const [processing, setProcessing] = useState({
        status: "offline",
        processed_events: 0,
        throughput: 0,
        last_event: null,
        last_event_time: null,
        last_window_id: null,
        last_window_count: 0,
    });

    const [loadingStats, setLoadingStats] =
        useState(false);

    const [lastUpdated, setLastUpdated] =
        useState(null);


    // =========================================================
    // LOAD STREAMS
    // =========================================================

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


    // =========================================================
    // LOAD STATS
    // =========================================================

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


    // =========================================================
    // LOAD PROCESSING
    // =========================================================

    const loadProcessingStatus =
        useCallback(async () => {

            try {

                const response =
                    await getProcessingStatus();

                setProcessing(
                    response.data || {}
                );

            } catch (error) {

                console.log(
                    "Unable to load processing status:",
                    error
                );

            }

        }, []);


    // =========================================================
    // INITIAL LOAD
    // =========================================================

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


        const processingInterval =
            setInterval(
                loadProcessingStatus,
                2000
            );


        const statsInterval =
            setInterval(
                loadStats,
                5000
            );


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
    ]);


    // =========================================================
    // DELETE STREAM
    // =========================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this stream?"
            );

        if (!confirmDelete) return;

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


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        alert(
            "Logged out successfully!"
        );

        navigate("/login");

    };


    // =========================================================
    // CALCULATIONS
    // =========================================================

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


    // =========================================================
    // SIDEBAR BUTTON
    // =========================================================

    const SidebarButton = ({
        section,
        icon,
        children,
    }) => (

        <button
            className={
                activeSection === section
                    ? "sidebar-nav-item active"
                    : "sidebar-nav-item"
            }
            onClick={() =>
                setActiveSection(section)
            }
        >

            <span className="sidebar-icon">
                {icon}
            </span>

            <span>
                {children}
            </span>

        </button>

    );


    return (

        <>

            <Navbar />


            <div className="dashboard-layout">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="dashboard-sidebar">

                    <div className="sidebar-logo">

                        <span className="sidebar-logo-icon">
                            ⚡
                        </span>

                        <span>
                            StreamForge
                        </span>

                    </div>


                    <div className="sidebar-menu-title">
                        DASHBOARD
                    </div>


                    <nav>

                        <SidebarButton
                            section="overview"
                            icon="🏠"
                        >
                            Overview
                        </SidebarButton>


                        <SidebarButton
                            section="health"
                            icon="❤️"
                        >
                            System Health
                        </SidebarButton>


                        <SidebarButton
                            section="processing"
                            icon="⚡"
                        >
                            Live Processing
                        </SidebarButton>


                        <SidebarButton
                            section="statistics"
                            icon="📊"
                        >
                            Statistics
                        </SidebarButton>


                        <SidebarButton
                            section="grafana"
                            icon="📈"
                        >
                            Grafana
                        </SidebarButton>


                        <SidebarButton
                            section="streams"
                            icon="🚚"
                        >
                            Your Streams
                        </SidebarButton>


                        <button
                            className="sidebar-nav-item"
                            onClick={() =>
                                navigate("/topology")
                            }
                        >

                            <span className="sidebar-icon">
                                🔗
                            </span>

                            <span>
                                Topology
                            </span>

                        </button>

                    </nav>


                    <div className="sidebar-bottom">

                        <button
                            className="sidebar-nav-item sidebar-logout"
                            onClick={handleLogout}
                        >

                            <span className="sidebar-icon">
                                🚪
                            </span>

                            <span>
                                Logout
                            </span>

                        </button>

                    </div>

                </aside>


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <main className="dashboard">


                    {/* =================================================
                        OVERVIEW
                    ================================================= */}

                    {activeSection === "overview" && (

                        <section className="dashboard-section">

                            <div className="section-heading">

                                <div>

                                    <div className="eyebrow">
                                        STREAMFORGE
                                    </div>

                                    <h1 className="title">
                                        Dashboard Overview
                                    </h1>

                                    <p className="subtitle">
                                        Real-time stream processing
                                        monitoring platform
                                    </p>

                                </div>

                                <div className="live-badge">

                                    <span className="live-dot"></span>

                                    LIVE

                                </div>

                            </div>


                            {/* SUMMARY CARDS */}

                            <div className="stats-grid">


                                <div className="stat-card stat-blue">

                                    <div className="stat-card-top">

                                        <div>

                                            <span className="stat-label">
                                                TOTAL EVENTS
                                            </span>

                                            <h3>
                                                Total Events
                                            </h3>

                                        </div>

                                        <div className="stat-icon">
                                            ⚡
                                        </div>

                                    </div>

                                    <p className="stat-number">
                                        {totalEvents}
                                    </p>

                                    <small>
                                        Processed events
                                    </small>

                                </div>


                                <div className="stat-card stat-green">

                                    <div className="stat-card-top">

                                        <div>

                                            <span className="stat-label">
                                                STREAMS
                                            </span>

                                            <h3>
                                                Active Streams
                                            </h3>

                                        </div>

                                        <div className="stat-icon">
                                            🚚
                                        </div>

                                    </div>

                                    <p className="stat-number">
                                        {streams.length}
                                    </p>

                                    <small>
                                        Available streams
                                    </small>

                                </div>


                                <div className="stat-card stat-yellow">

                                    <div className="stat-card-top">

                                        <div>

                                            <span className="stat-label">
                                                WINDOWS
                                            </span>

                                            <h3>
                                                Statistics Windows
                                            </h3>

                                        </div>

                                        <div className="stat-icon">
                                            📊
                                        </div>

                                    </div>

                                    <p className="stat-number">
                                        {statisticsWindows}
                                    </p>

                                    <small>
                                        Processing windows
                                    </small>

                                </div>


                                <div className="stat-card stat-purple">

                                    <div className="stat-card-top">

                                        <div>

                                            <span className="stat-label">
                                                BYTEWAX
                                            </span>

                                            <h3>
                                                Processor
                                            </h3>

                                        </div>

                                        <div className="stat-icon">
                                            🔥
                                        </div>

                                    </div>

                                    <p
                                        className={
                                            processing.status === "online"
                                                ? "stat-number status-online"
                                                : "stat-number status-offline"
                                        }
                                    >
                                        {
                                            (
                                                processing.status ||
                                                "offline"
                                            ).toUpperCase()
                                        }
                                    </p>

                                    <small>
                                        Bytewax processor
                                    </small>

                                </div>


                            </div>


                            {/* CREATE STREAM */}

                            <div className="dashboard-panel create-panel">

                                <div className="panel-heading">

                                    <div>

                                        <h2>
                                            Create New Stream
                                        </h2>

                                        <p>
                                            Add a new real-time
                                            data stream to StreamForge.
                                        </p>

                                    </div>

                                    <span className="panel-icon">
                                        ➕
                                    </span>

                                </div>


                                <CreateStream
                                    loadStreams={loadStreams}
                                />

                            </div>


                        </section>

                    )}


                    {/* =================================================
                        SYSTEM HEALTH
                    ================================================= */}

                    {activeSection === "health" && (

                        <section className="dashboard-section">

                            <div className="section-heading">

                                <div>

                                    <div className="eyebrow">
                                        INFRASTRUCTURE
                                    </div>

                                    <h1 className="title">
                                        System Health
                                    </h1>

                                    <p className="subtitle">
                                        Monitor the health of
                                        StreamForge services.
                                    </p>

                                </div>

                                <div className="health-badge">
                                    ❤️ Services
                                </div>

                            </div>


                            <div className="health-wrapper">

                                <SystemHealth />

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        LIVE PROCESSING
                    ================================================= */}

                    {activeSection === "processing" && (

                        <section className="dashboard-section">

                            <div className="section-heading">

                                <div>

                                    <div className="eyebrow">
                                        REAL-TIME ENGINE
                                    </div>

                                    <h1 className="title">
                                        Live Processing
                                    </h1>

                                    <p className="subtitle">
                                        Real-time Bytewax stream
                                        processing status.
                                    </p>

                                </div>

                                <div className="live-badge">

                                    <span className="live-dot"></span>

                                    PROCESSING

                                </div>

                            </div>


                            <div className="processing-grid">


                                <div className="processing-card">

                                    <div className="processing-icon">
                                        ⚡
                                    </div>

                                    <span>
                                        PROCESSOR
                                    </span>

                                    <p
                                        className={
                                            processing.status === "online"
                                                ? "processing-value online"
                                                : "processing-value offline"
                                        }
                                    >
                                        {
                                            (
                                                processing.status ||
                                                "offline"
                                            ).toUpperCase()
                                        }
                                    </p>

                                </div>


                                <div className="processing-card">

                                    <div className="processing-icon">
                                        📦
                                    </div>

                                    <span>
                                        PROCESSED EVENTS
                                    </span>

                                    <p className="processing-value">
                                        {
                                            processing.processed_events ??
                                            0
                                        }
                                    </p>

                                </div>


                                <div className="processing-card">

                                    <div className="processing-icon">
                                        🚀
                                    </div>

                                    <span>
                                        THROUGHPUT
                                    </span>

                                    <p className="processing-value">
                                        {
                                            Number(
                                                processing.throughput ?? 0
                                            ).toFixed(2)
                                        }

                                        <small>
                                            {" events/sec"}
                                        </small>

                                    </p>

                                </div>


                                <div className="processing-card">

                                    <div className="processing-icon">
                                        🪟
                                    </div>

                                    <span>
                                        LAST WINDOW
                                    </span>

                                    <p className="processing-value">
                                        {
                                            processing.last_window_id ??
                                            "N/A"
                                        }
                                    </p>

                                </div>


                                <div className="processing-card">

                                    <div className="processing-icon">
                                        📊
                                    </div>

                                    <span>
                                        WINDOW EVENTS
                                    </span>

                                    <p className="processing-value">
                                        {
                                            processing.last_window_count ??
                                            0
                                        }
                                    </p>

                                </div>


                            </div>


                            {/* LATEST EVENT */}

                            <div className="last-event-card">

                                <div className="panel-heading">

                                    <div>

                                        <h2>
                                            Latest Event
                                        </h2>

                                        <p>
                                            Most recently processed
                                            telemetry event.
                                        </p>

                                    </div>

                                    <span className="panel-icon">
                                        📡
                                    </span>

                                </div>


                                {processing.last_event ? (

                                    <div className="event-details">

                                        <div className="event-item">

                                            <span>
                                                Truck
                                            </span>

                                            <strong>
                                                {
                                                    processing.last_event
                                                        .truck_id ?? "N/A"
                                                }
                                            </strong>

                                        </div>


                                        <div className="event-item">

                                            <span>
                                                Temperature
                                            </span>

                                            <strong>
                                                {
                                                    processing.last_event
                                                        .temperature ?? "N/A"
                                                } °C
                                            </strong>

                                        </div>


                                        <div className="event-item">

                                            <span>
                                                Speed
                                            </span>

                                            <strong>
                                                {
                                                    processing.last_event
                                                        .speed ?? "N/A"
                                                }
                                            </strong>

                                        </div>


                                        <div className="event-item">

                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                {
                                                    processing.last_event
                                                        .latitude ?? "N/A"
                                                }

                                                {", "}

                                                {
                                                    processing.last_event
                                                        .longitude ?? "N/A"
                                                }
                                            </strong>

                                        </div>


                                        <div className="event-item">

                                            <span>
                                                Event Time
                                            </span>

                                            <strong>

                                                {
                                                    processing.last_event
                                                        .timestamp
                                                        ? new Date(
                                                            processing
                                                                .last_event
                                                                .timestamp
                                                        ).toLocaleString()
                                                        : "N/A"
                                                }

                                            </strong>

                                        </div>


                                        <div className="event-item">

                                            <span>
                                                Processed
                                            </span>

                                            <strong className="processed-yes">
                                                {
                                                    processing.last_event
                                                        .processed
                                                        ? "YES"
                                                        : "NO"
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="empty-state">
                                        No events processed yet.
                                    </div>

                                )}


                                <div className="processed-at">

                                    <span>
                                        Last Processed At
                                    </span>

                                    <strong>

                                        {
                                            processing.last_event_time
                                                ? new Date(
                                                    processing.last_event_time
                                                ).toLocaleString()
                                                : "N/A"
                                        }

                                    </strong>

                                </div>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    {activeSection === "statistics" && (

                        <section className="dashboard-section">

                            <div className="section-heading">

                                <div>

                                    <div className="eyebrow">
                                        ANALYTICS
                                    </div>

                                    <h1 className="title">
                                        Stream Statistics
                                    </h1>

                                    <p className="subtitle">
                                        Window-based event processing
                                        statistics.
                                    </p>

                                </div>

                                <div className="update-badge">
                                    {loadingStats
                                        ? "Updating..."
                                        : lastUpdated
                                            ? `Updated ${lastUpdated.toLocaleTimeString()}`
                                            : "Waiting"
                                    }
                                </div>

                            </div>


                            {stats.length > 0 ? (

                                <div className="chart-panel">

                                    <div className="panel-heading">

                                        <div>

                                            <h2>
                                                Events per Window
                                            </h2>

                                            <p>
                                                10-second tumbling
                                                window statistics
                                            </p>

                                        </div>

                                        <span className="panel-icon">
                                            📊
                                        </span>

                                    </div>


                                    <div className="chart-container">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <BarChart
                                                data={stats}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#263244"
                                                />

                                                <XAxis
                                                    dataKey="window_id"
                                                    tick={{
                                                        fill: "#b8c1d1",
                                                        fontSize: 14,
                                                    }}
                                                />

                                                <YAxis
                                                    tick={{
                                                        fill: "#b8c1d1",
                                                        fontSize: 14,
                                                    }}
                                                />

                                                <Tooltip
                                                    contentStyle={{
                                                        background:
                                                            "#111827",
                                                        border:
                                                            "1px solid #374151",
                                                        borderRadius:
                                                            "10px",
                                                        color:
                                                            "#ffffff",
                                                        fontSize:
                                                            "14px",
                                                    }}
                                                />

                                                <Bar
                                                    dataKey="total_events"
                                                    fill="#00bfff"
                                                    radius={[
                                                        7,
                                                        7,
                                                        0,
                                                        0,
                                                    ]}
                                                />

                                            </BarChart>

                                        </ResponsiveContainer>

                                    </div>

                                </div>

                            ) : (

                                <div className="empty-panel">

                                    <span>
                                        📊
                                    </span>

                                    <h3>
                                        No Statistics Available
                                    </h3>

                                    <p>
                                        Statistics will appear here
                                        when events are processed.
                                    </p>

                                </div>

                            )}


                            {stats.length > 0 && (

                                <div className="statistics-details">

                                    {stats.map(
                                        (stat, index) => (

                                            <div
                                                className="window-card"
                                                key={
                                                    stat.id ||
                                                    index
                                                }
                                            >

                                                <div className="window-card-header">

                                                    <span>
                                                        WINDOW
                                                    </span>

                                                    <strong>
                                                        {
                                                            stat.window_id ??
                                                            "N/A"
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="window-value">

                                                    {
                                                        stat.total_events ??
                                                        0
                                                    }

                                                    <small>
                                                        events
                                                    </small>

                                                </div>


                                                <div className="window-meta">

                                                    <p>

                                                        <span>
                                                            Owner
                                                        </span>

                                                        <strong>
                                                            {
                                                                stat.owner_id ??
                                                                "N/A"
                                                            }
                                                        </strong>

                                                    </p>


                                                    {stat.created_at && (

                                                        <p>

                                                            <span>
                                                                Created
                                                            </span>

                                                            <strong>
                                                                {
                                                                    new Date(
                                                                        stat.created_at
                                                                    ).toLocaleString()
                                                                }
                                                            </strong>

                                                        </p>

                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    )}


                    {/* =================================================
                        GRAFANA
                    ================================================= */}

                    {activeSection === "grafana" && (

                        <section className="dashboard-section">

                            <div className="section-heading">

                                <div>

                                    <div className="eyebrow">
                                        OBSERVABILITY
                                    </div>

                                    <h1 className="title">
                                        Infrastructure Monitoring
                                    </h1>

                                    <p className="subtitle">
                                        Real-time application and
                                        event-processing metrics.
                                    </p>

                                </div>

                                <div className="grafana-badge">
                                    📈 Grafana
                                </div>

                            </div>


                            <div className="grafana-wrapper">

                                <GrafanaDashboard />

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        STREAMS
                    ================================================= */}

                    {activeSection === "streams" && (

                        <section className="dashboard-section">

                            <div className="section-heading">

                                <div>

                                    <div className="eyebrow">
                                        STREAM MANAGEMENT
                                    </div>

                                    <h1 className="title">
                                        Your Streams
                                    </h1>

                                    <p className="subtitle">
                                        Manage your active
                                        StreamForge streams.
                                    </p>

                                </div>

                                <div className="stream-count-badge">
                                    🚚 {streams.length} Streams
                                </div>

                            </div>


                            {streams.length === 0 ? (

                                <div className="empty-panel">

                                    <span>
                                        🚚
                                    </span>

                                    <h3>
                                        No Streams Available
                                    </h3>

                                    <p>
                                        Create your first stream
                                        from the Overview section.
                                    </p>

                                </div>

                            ) : (

                                <div className="streams-grid">

                                    {streams.map(
                                        (stream) => (

                                            <div
                                                className="stream-card"
                                                key={stream.id}
                                            >

                                                <div className="stream-card-top">

                                                    <div className="stream-icon">
                                                        🚚
                                                    </div>

                                                    <span className="active-stream">
                                                        ● ACTIVE
                                                    </span>

                                                </div>


                                                <h3>
                                                    {stream.title}
                                                </h3>


                                                <p>
                                                    {
                                                        stream.description ||
                                                        "Real-time data stream"
                                                    }
                                                </p>


                                                <div className="stream-id">
                                                    Stream ID: #{stream.id}
                                                </div>


                                                <div className="stream-actions">

                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() =>
                                                            navigate(
                                                                `/edit-stream/${stream.id}`
                                                            )
                                                        }
                                                    >
                                                        ✏️ Edit
                                                    </button>


                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                stream.id
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    )}

                </main>

            </div>

        </>

    );

}


export default Dashboard;