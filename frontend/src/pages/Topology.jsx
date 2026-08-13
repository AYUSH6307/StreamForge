import { useEffect, useCallback } from "react";

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const API_URL = "http://127.0.0.1:8001";

const getNodeStyle = (status) => {
    const online = status === "online";

    return {
        background: online ? "#123d2a" : "#3d1720",
        color: "white",
        border: online
            ? "2px solid #52b788"
            : "2px solid #ef476f",
        borderRadius: "12px",
        padding: "15px",
        width: 190,
        textAlign: "center",
        fontWeight: "600",
    };
};

const initialNodes = [
    {
        id: "kafka",
        position: { x: 50, y: 180 },
        data: {
            label: "Apache Kafka\nChecking...",
        },
        style: getNodeStyle("offline"),
    },
    {
        id: "bytewax",
        position: { x: 300, y: 180 },
        data: {
            label: "Bytewax\nStream Processor",
        },
        style: {
            ...getNodeStyle("online"),
            background: "#14213d",
            border: "2px solid #4cc9f0",
        },
    },
    {
        id: "stats",
        position: { x: 550, y: 180 },
        data: {
            label: "StreamStats\nRocksDB State",
        },
        style: {
            ...getNodeStyle("online"),
            background: "#003049",
            border: "2px solid #00b4d8",
        },
    },
    {
        id: "fastapi",
        position: { x: 800, y: 180 },
        data: {
            label: "FastAPI\nChecking...",
        },
        style: getNodeStyle("offline"),
    },
    {
        id: "react",
        position: { x: 1050, y: 180 },
        data: {
            label: "React Dashboard\nOnline",
        },
        style: {
            ...getNodeStyle("online"),
            background: "#3a0ca3",
            border: "2px solid #7209b7",
        },
    },
    {
        id: "prometheus",
        position: { x: 550, y: 400 },
        data: {
            label: "Prometheus\nMonitoring",
        },
        style: {
            ...getNodeStyle("online"),
            background: "#7f2704",
            border: "2px solid #ff9f1c",
        },
    },
    {
        id: "grafana",
        position: { x: 800, y: 400 },
        data: {
            label: "Grafana\nMonitoring",
        },
        style: {
            ...getNodeStyle("online"),
            background: "#5a189a",
            border: "2px solid #c77dff",
        },
    },
];

const initialEdges = [
    {
        id: "kafka-bytewax",
        source: "kafka",
        target: "bytewax",
        animated: true,
        label: "events",
    },
    {
        id: "bytewax-stats",
        source: "bytewax",
        target: "stats",
        animated: true,
        label: "processed",
    },
    {
        id: "stats-fastapi",
        source: "stats",
        target: "fastapi",
        animated: true,
        label: "statistics",
    },
    {
        id: "fastapi-react",
        source: "fastapi",
        target: "react",
        animated: true,
        label: "REST API",
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
        label: "monitoring",
    },
];

function Topology() {
    const [nodes, setNodes, onNodesChange] =
        useNodesState(initialNodes);

    const [edges, setEdges, onEdgesChange] =
        useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection) =>
            setEdges((currentEdges) =>
                addEdge(connection, currentEdges)
            ),
        [setEdges]
    );

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
                                        `Apache Kafka\n${health.kafka.toUpperCase()}`,
                                },
                                style: getNodeStyle(
                                    health.kafka
                                ),
                            };
                        }

                        if (node.id === "fastapi") {
                            return {
                                ...node,
                                data: {
                                    label:
                                        `FastAPI\n${health.api.toUpperCase()}`,
                                },
                                style: getNodeStyle(
                                    health.api
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
            }
        };

        checkHealth();

        const interval = setInterval(
            checkHealth,
            5000
        );

        return () => clearInterval(interval);
    }, [setNodes]);

    return (
        <div
            style={{
                width: "100%",
                height: "calc(100vh - 70px)",
                background: "#0b132b",
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default Topology;