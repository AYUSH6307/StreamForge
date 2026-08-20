function GrafanaDashboard() {
    const panels = [
        {
            id: "panel-1",
            title: "Throughput",
        },
        {
            id: "panel-2",
            title: "Total Events Processed",
        },
        {
            id: "panel-3",
            title: "Active Workers",
        },
        {
            id: "panel-4",
            title: "Window Events",
        },
        {
            id: "panel-5",
            title: "Last Processing Window",
        },
        {
            id: "panel-6",
            title: "Last Window Event",
        },
    ];

    return (
        <div
            style={{
                width: "100%",
                padding: "10px 0",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div
                style={{
                    marginBottom: "20px",
                }}
            >
                <h2
                    style={{
                        color: "white",
                        margin: 0,
                        fontSize: "26px",
                    }}
                >
                    Grafana Monitoring
                </h2>

                <p
                    style={{
                        color: "#9ca3af",
                        marginTop: "6px",
                        marginBottom: 0,
                        fontSize: "16px",
                    }}
                >
                    Real-time StreamForge metrics
                </p>
            </div>

            {/* Grafana Panels */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                    gap: "18px",
                    width: "100%",
                }}
            >
                {panels.map((panel) => (
                    <div
                        key={panel.id}
                        style={{
                            width: "100%",
                            minWidth: 0,
                            overflow: "hidden",
                            borderRadius: "10px",
                            background: "transparent",
                        }}
                    >
                        <iframe
                            src={`http://localhost:3001/d-solo/ad5bgmd/streamforge-throughput?orgId=1&from=now-6h&to=now&timezone=browser&theme=dark&hidePanelHeader=true&panelId=${panel.id}`}
                            title={panel.title}
                            width="100%"
                            height="250"
                            frameBorder="0"
                            style={{
                                width: "100%",
                                height: "250px",
                                border: "none",
                                display: "block",
                                background: "transparent",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GrafanaDashboard;