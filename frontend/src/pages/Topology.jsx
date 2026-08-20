import { useEffect, useCallback, useState } from "react";

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const API_URL = "http://127.0.0.1:8001";

/* =========================================================
   NODE COLORS / STYLES
========================================================= */

const getNodeStyle = (status, color = "#4cc9f0") => {
    const online = status === "online";

    return {
        background: online ? "#102a43" : "#3d1720",
        color: "white",
        border: online
            ? `2px solid ${color}`
            : "2px solid #ef476f",
        borderRadius: "14px",
        padding: "15px",
        width: 190,
        textAlign: "center",
        fontWeight: "600",
        boxShadow: online
            ? `0 0 15px ${color}55`
            : "0 0 15px #ef476f55",
        cursor: "pointer",
    };
};

/* =========================================================
   COMPONENT INFORMATION
========================================================= */

const componentInfo = {
    frontend: {
        title: "React Frontend",
        type: "Frontend",
        role: "User interface and dashboard",
        location: "Frontend application",
        address: "http://localhost:3000",
        details:
            "Provides the StreamForge dashboard, stream management, statistics, health monitoring and topology visualization.",
    },

    fastapi: {
        title: "FastAPI Backend",
        type: "Backend API",
        role: "REST API and application server",
        location: "Backend",
        address: "http://127.0.0.1:8001",
        details:
            "Handles authentication, streams, statistics, health checks and communication between the frontend and backend services.",
    },

    kafka: {
        title: "Apache Kafka",
        type: "Event Streaming",
        role: "Event/message streaming",
        location: "Docker container",
        address: "127.0.0.1:9092",
        details:
            "Receives and distributes real-time stream events through Kafka topics.",
    },

    producer: {
        title: "Kafka Producer",
        type: "Event Producer",
        role: "Publishes stream events",
        location: "Backend service",
        address: "127.0.0.1:8001",
        details:
            "Creates and publishes stream events to the Kafka stream-events topic.",
    },

    topic: {
        title: "Kafka Topic",
        type: "Kafka Topic",
        role: "Event buffer / stream channel",
        location: "Apache Kafka",
        address: "stream-events",
        details:
            "The stream-events topic carries events from the producer to the Bytewax stream processor.",
    },

    bytewax: {
        title: "Bytewax Processor",
        type: "Stream Processor",
        role: "Real-time event processing",
        location: "Python process",
        address: "Bytewax runtime",
        details:
            "Consumes Kafka events, processes timestamps, performs window-based processing and generates stream statistics.",
    },

    rocksdb: {
        title: "RocksDB",
        type: "State Store",
        role: "Window/state storage",
        location: "Local data directory",
        address: "data/rocksdb",
        details:
            "Maintains processing state and window information used by the stream processor.",
    },

    sqlite: {
        title: "SQLite",
        type: "Database",
        role: "Persistent application data",
        location: "Backend",
        address: "streamforge.db",
        details:
            "Stores users, streams and generated stream statistics through SQLAlchemy.",
    },

    stats: {
        title: "Stream Statistics",
        type: "Statistics Layer",
        role: "Processed stream statistics",
        location: "Backend / SQLite",
        address: "/stats",
        details:
            "Stores and exposes processed event counts and window statistics for the dashboard.",
    },

    prometheus: {
        title: "Prometheus",
        type: "Monitoring",
        role: "Metrics collection",
        location: "Monitoring service",
        address: "http://localhost:9090",
        details:
            "Collects application and system metrics exposed by StreamForge.",
    },

    grafana: {
        title: "Grafana",
        type: "Monitoring Dashboard",
        role: "Metrics visualization",
        location: "Monitoring service",
        address: "http://localhost:3001",
        details:
            "Visualizes StreamForge metrics through monitoring panels and dashboards.",
    },
};

/* =========================================================
   INITIAL NODES
========================================================= */

const initialNodes = [
    {
        id: "frontend",
        position: { x: 1000, y: 80 },
        data: {
            label: "React Dashboard\nFrontend",
        },
        style: getNodeStyle("online", "#61dafb"),
    },

    {
        id: "fastapi",
        position: { x: 750, y: 80 },
        data: {
            label: "FastAPI\nChecking...",
        },
        style: getNodeStyle("offline", "#00b4d8"),
    },

    {
        id: "producer",
        position: { x: 500, y: 80 },
        data: {
            label: "Kafka Producer\nEvent Publisher",
        },
        style: getNodeStyle("online", "#f4a261"),
    },

    {
        id: "kafka",
        position: { x: 250, y: 80 },
        data: {
            label: "Apache Kafka\nChecking...",
        },
        style: getNodeStyle("offline", "#52b788"),
    },

    {
        id: "topic",
        position: { x: 250, y: 280 },
        data: {
            label: "Kafka Topic\nstream-events",
        },
        style: getNodeStyle("online", "#ffd166"),
    },

    {
        id: "bytewax",
        position: { x: 500, y: 280 },
        data: {
            label: "Bytewax\nStream Processor",
        },
        style: getNodeStyle("online", "#4cc9f0"),
    },

    {
        id: "rocksdb",
        position: { x: 750, y: 280 },
        data: {
            label: "RocksDB\nWindow State",
        },
        style: getNodeStyle("online", "#00b4d8"),
    },

    {
        id: "stats",
        position: { x: 1000, y: 280 },
        data: {
            label: "StreamStats\nStatistics",
        },
        style: getNodeStyle("online", "#48cae4"),
    },

    {
        id: "sqlite",
        position: { x: 1000, y: 500 },
        data: {
            label: "SQLite\nDatabase",
        },
        style: getNodeStyle("online", "#90be6d"),
    },

    {
        id: "prometheus",
        position: { x: 500, y: 500 },
        data: {
            label: "Prometheus\nMetrics",
        },
        style: getNodeStyle("online", "#ff9f1c"),
    },

    {
        id: "grafana",
        position: { x: 750, y: 500 },
        data: {
            label: "Grafana\nMonitoring",
        },
        style: getNodeStyle("online", "#c77dff"),
    },
];

/* =========================================================
   INITIAL EDGES
========================================================= */

const initialEdges = [
    {
        id: "frontend-fastapi",
        source: "frontend",
        target: "fastapi",
        animated: true,
        label: "REST API",
    },

    {
        id: "fastapi-producer",
        source: "fastapi",
        target: "producer",
        animated: true,
        label: "create event",
    },

    {
        id: "producer-kafka",
        source: "producer",
        target: "kafka",
        animated: true,
        label: "publish",
    },

    {
        id: "kafka-topic",
        source: "kafka",
        target: "topic",
        animated: true,
        label: "stream-events",
    },

    {
        id: "topic-bytewax",
        source: "topic",
        target: "bytewax",
        animated: true,
        label: "consume",
    },

    {
        id: "bytewax-rocksdb",
        source: "bytewax",
        target: "rocksdb",
        animated: true,
        label: "state",
    },

    {
        id: "bytewax-stats",
        source: "bytewax",
        target: "stats",
        animated: true,
        label: "statistics",
    },

    {
        id: "stats-sqlite",
        source: "stats",
        target: "sqlite",
        animated: true,
        label: "save",
    },

    {
        id: "stats-fastapi",
        source: "stats",
        target: "fastapi",
        animated: true,
        label: "stats API",
    },

    {
        id: "fastapi-prometheus",
        source: "fastapi",
        target: "prometheus",
        animated: true,
        label: "metrics",
    },

    {
        id: "prometheus-grafana",
        source: "prometheus",
        target: "grafana",
        animated: true,
        label: "metrics",
    },
];

/* =========================================================
   TOPOLOGY COMPONENT
========================================================= */

function Topology() {
    const [nodes, setNodes, onNodesChange] =
        useNodesState(initialNodes);

    const [edges, setEdges, onEdgesChange] =
        useEdgesState(initialEdges);

    const [selectedNode, setSelectedNode] =
        useState(null);

    /* =====================================================
       CONNECTION
    ===================================================== */

    const onConnect = useCallback(
        (connection) => {
            setEdges((currentEdges) =>
                addEdge(
                    {
                        ...connection,
                        animated: true,
                    },
                    currentEdges
                )
            );
        },
        [setEdges]
    );

    /* =====================================================
       NODE CLICK
    ===================================================== */

    const onNodeClick = useCallback(
        (event, node) => {
            setSelectedNode(node.id);

            setNodes((currentNodes) =>
                currentNodes.map((currentNode) => ({
                    ...currentNode,
                    style: {
                        ...currentNode.style,
                        boxShadow:
                            currentNode.id === node.id
                                ? "0 0 25px #ffffff"
                                : currentNode.style.boxShadow,
                    },
                }))
            );
        },
        [setNodes]
    );

    /* =====================================================
       HEALTH CHECK
    ===================================================== */

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/health/`
                );

                const health = await response.json();

                setNodes((currentNodes) =>
                    currentNodes.map((node) => {
                        if (node.id === "kafka") {
                            return {
                                ...node,
                                data: {
                                    label:
                                        `Apache Kafka\n${String(
                                            health.kafka || "offline"
                                        ).toUpperCase()}`,
                                },
                                style: getNodeStyle(
                                    health.kafka,
                                    "#52b788"
                                ),
                            };
                        }

                        if (node.id === "fastapi") {
                            return {
                                ...node,
                                data: {
                                    label:
                                        `FastAPI\n${String(
                                            health.api || "offline"
                                        ).toUpperCase()}`,
                                },
                                style: getNodeStyle(
                                    health.api,
                                    "#00b4d8"
                                ),
                            };
                        }

                        return node;
                    })
                );

            } catch (error) {
                console.error(
                    "Health check failed:",
                    error
                );

                setNodes((currentNodes) =>
                    currentNodes.map((node) => {
                        if (
                            node.id === "kafka" ||
                            node.id === "fastapi"
                        ) {
                            return {
                                ...node,
                                style: getNodeStyle(
                                    "offline"
                                ),
                            };
                        }

                        return node;
                    })
                );
            }
        };

        checkHealth();

        const interval = setInterval(
            checkHealth,
            5000
        );

        return () => clearInterval(interval);
    }, [setNodes]);

    /* =====================================================
       SELECTED COMPONENT
    ===================================================== */

    const selectedInfo =
        selectedNode
            ? componentInfo[selectedNode]
            : null;

    return (
        <div
            style={{
                width: "100%",
                height: "calc(100vh - 70px)",
                background: "#07111f",
                position: "relative",
            }}
        >

            {/* HEADER */}
            <div
                style={{
                    position: "absolute",
                    top: 15,
                    left: 20,
                    zIndex: 10,
                    color: "white",
                    background: "rgba(7,17,31,0.9)",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    border: "1px solid #243b53",
                }}
            >
                <strong>
                    StreamForge Topology
                </strong>

                <div
                    style={{
                        fontSize: "12px",
                        color: "#9fb3c8",
                        marginTop: 4,
                    }}
                >
                    Click any component to view details
                </div>
            </div>

            {/* REACT FLOW */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                fitViewOptions={{
                    padding: 0.2,
                }}
            >
                <Background
                    gap={20}
                    size={1}
                />

                <Controls />

                <MiniMap
                    nodeColor={(node) => {
                        if (
                            node.id === "kafka" ||
                            node.id === "topic"
                        ) {
                            return "#52b788";
                        }

                        if (node.id === "bytewax") {
                            return "#4cc9f0";
                        }

                        if (node.id === "grafana") {
                            return "#c77dff";
                        }

                        return "#4cc9f0";
                    }}
                />
            </ReactFlow>

            {/* =================================================
                DETAILS PANEL
            ================================================= */}

            {selectedInfo && (
                <div
                    style={{
                        position: "absolute",
                        right: 20,
                        top: 20,
                        width: 320,
                        maxWidth: "calc(100% - 40px)",
                        background: "#102a43",
                        color: "white",
                        borderRadius: "14px",
                        padding: "20px",
                        zIndex: 20,
                        boxShadow:
                            "0 10px 35px rgba(0,0,0,0.5)",
                        border:
                            "1px solid #334e68",
                    }}
                >

                    {/* CLOSE */}
                    <button
                        onClick={() =>
                            setSelectedNode(null)
                        }
                        style={{
                            position: "absolute",
                            right: 12,
                            top: 10,
                            background: "transparent",
                            border: "none",
                            color: "#bcccdc",
                            fontSize: "20px",
                            cursor: "pointer",
                        }}
                    >
                        ×
                    </button>

                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: 5,
                            color: "#4cc9f0",
                        }}
                    >
                        {selectedInfo.title}
                    </h2>

                    <div
                        style={{
                            color: "#9fb3c8",
                            fontSize: "13px",
                            marginBottom: 18,
                        }}
                    >
                        {selectedInfo.type}
                    </div>

                    <div
                        style={{
                            marginBottom: 12,
                        }}
                    >
                        <strong>Role</strong>

                        <div
                            style={{
                                color: "#d9e2ec",
                                marginTop: 4,
                            }}
                        >
                            {selectedInfo.role}
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: 12,
                        }}
                    >
                        <strong>Location</strong>

                        <div
                            style={{
                                color: "#d9e2ec",
                                marginTop: 4,
                            }}
                        >
                            {selectedInfo.location}
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: 12,
                        }}
                    >
                        <strong>Address</strong>

                        <div
                            style={{
                                color: "#4cc9f0",
                                marginTop: 4,
                                wordBreak: "break-word",
                            }}
                        >
                            {selectedInfo.address}
                        </div>
                    </div>

                    <div>
                        <strong>What it does</strong>

                        <div
                            style={{
                                color: "#d9e2ec",
                                marginTop: 5,
                                lineHeight: 1.5,
                                fontSize: "14px",
                            }}
                        >
                            {selectedInfo.details}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Topology;