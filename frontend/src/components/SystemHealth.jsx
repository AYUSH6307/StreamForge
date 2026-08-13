import { useEffect, useState } from "react";
import { getHealth } from "../services/healthService";

function SystemHealth() {
    const [health, setHealth] = useState(null);
    const [error, setError] = useState(false);

    const loadHealth = async () => {
        try {
            const response = await getHealth();
            setHealth(response.data);
            setError(false);
        } catch (err) {
            console.log("Health check failed:", err);
            setError(true);
        }
    };

    useEffect(() => {
        loadHealth();

        const interval = setInterval(() => {
            loadHealth();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div style={{
                background: "#3b0d0d",
                color: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "25px"
            }}>
                <h2>System Health</h2>
                <p>🔴 Backend unavailable</p>
            </div>
        );
    }

    if (!health) {
        return (
            <div style={{
                color: "white",
                padding: "20px"
            }}>
                Checking system health...
            </div>
        );
    }

    const isOnline = (value) => value === "online";

    return (
        <div
            style={{
                background: "#111827",
                color: "white",
                padding: "20px",
                borderRadius: "15px",
                marginBottom: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <h2>System Health</h2>

                <span
                    style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background:
                            health.status === "healthy"
                                ? "#14532d"
                                : "#78350f"
                    }}
                >
                    {health.status === "healthy"
                        ? "🟢 Healthy"
                        : "🟠 Degraded"}
                </span>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "15px",
                    marginTop: "20px"
                }}
            >
                <HealthCard
                    title="API"
                    status={health.api}
                />

                <HealthCard
                    title="Database"
                    status={health.database}
                />

                <HealthCard
                    title="Kafka"
                    status={health.kafka}
                />

                <HealthCard
                    title="Processor"
                    status={health.processor}
                />
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "15px",
                    marginTop: "20px"
                }}
            >
                <InfoCard
                    title="Processed Events"
                    value={health.processed_events}
                />

                <InfoCard
                    title="Last Event"
                    value={health.last_event || "None"}
                />

                <InfoCard
                    title="Last Window"
                    value={health.last_window_id || "None"}
                />

                <InfoCard
                    title="Window Count"
                    value={health.last_window_count}
                />
            </div>

            <p
                style={{
                    marginTop: "20px",
                    fontSize: "13px",
                    color: "#9ca3af"
                }}
            >
                Auto-refreshing every 5 seconds
            </p>
        </div>
    );
}

function HealthCard({ title, status }) {
    const online = status === "online";

    return (
        <div
            style={{
                background: "#1f2937",
                padding: "15px",
                borderRadius: "10px",
                border: online
                    ? "1px solid #22c55e"
                    : "1px solid #ef4444"
            }}
        >
            <h4 style={{ margin: "0 0 8px" }}>
                {title}
            </h4>

            <span>
                {online ? "🟢 Online" : "🔴 Offline"}
            </span>
        </div>
    );
}

function InfoCard({ title, value }) {
    return (
        <div
            style={{
                background: "#1f2937",
                padding: "15px",
                borderRadius: "10px"
            }}
        >
            <h4
                style={{
                    margin: "0 0 8px",
                    color: "#9ca3af"
                }}
            >
                {title}
            </h4>

            <strong>{value}</strong>
        </div>
    );
}

export default SystemHealth;