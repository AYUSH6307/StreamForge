function GrafanaDashboard() {
    return (
        <div
            style={{
                marginTop: "40px",
                marginBottom: "40px",
                background: "#111827",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
        >
            <h2
                style={{
                    color: "white",
                    marginBottom: "20px",
                }}
            >
                Grafana Monitoring
            </h2>

            <div
                style={{
                    width: "100%",
                    height: "600px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    background: "#000",
                }}
            >
                <iframe
                    src="http://localhost:3001/d/ad4k5nt/total-event-processed?orgId=1&from=now-5m&to=now&timezone=browser&kiosk=1"
                    title="StreamForge Grafana Dashboard"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{
                        border: "none",
                    }}
                />
            </div>
        </div>
    );
}

export default GrafanaDashboard;