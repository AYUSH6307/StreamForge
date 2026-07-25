from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running successfully!"

@app.route("/stats")
def stats():
    return jsonify({
        "topics": 12,
        "consumers": 18,
        "messages": 5030,
        "throughput": 850
    })
@app.route("/throughput")
def throughput():
    return jsonify([
        {"time": "10 AM", "messages": 200},
        {"time": "11 AM", "messages": 350},
        {"time": "12 PM", "messages": 500},
        {"time": "1 PM", "messages": 700},
        {"time": "2 PM", "messages": 900}
    ])


@app.route("/lag")
def lag():
    return jsonify([
        {"time": "10 AM", "lag": 40},
        {"time": "11 AM", "lag": 80},
        {"time": "12 PM", "lag": 60},
        {"time": "1 PM", "lag": 120},
        {"time": "2 PM", "lag": 90}
    ])


@app.route("/topics")
def topics():
    return jsonify([
        {
            "topic": "user-events",
            "messages": 1200,
            "status": "Active"
        },
        {
            "topic": "payment-events",
            "messages": 900,
            "status": "Active"
        },
        {
            "topic": "logs",
            "messages": 500,
            "status": "Active"
        }
    ])



if __name__ == "__main__":
    app.run(debug=True)

