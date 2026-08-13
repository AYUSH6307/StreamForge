# 🚀 StreamForge

## Real-Time Stream Processing Platform

StreamForge is a full-stack **Real-Time Stream Processing Platform** built using **FastAPI, React.js, SQLite, Apache Kafka, Bytewax, RocksDB, Prometheus, Grafana and Docker**.

The platform allows authenticated users to create and manage streams. Stream creation generates real-time events that are published to Apache Kafka. Bytewax consumes and processes these events using time-based windows, calculates event statistics, and stores persistent window state using RocksDB.

The processed information is exposed through FastAPI APIs and visualized on the React dashboard and Grafana monitoring dashboard.

---

# 📌 Project Objective

The main objective of StreamForge is to demonstrate a complete event-driven real-time stream processing architecture.

The platform provides:

- User Registration and Login
- JWT-based Authentication
- Protected REST APIs
- Stream CRUD Operations
- SQLite Database Management
- Apache Kafka Integration
- Kafka Producer
- Kafka Event Streaming
- Bytewax Real-Time Processing
- Event Timestamp Processing
- Time-Based Event Windowing
- Event Counting
- Persistent Processing State using RocksDB
- Processing Status Monitoring
- Prometheus Metrics
- Grafana Monitoring
- React Dashboard
- Real-Time Statistics Visualization
- System Health Monitoring
- Stream Topology Visualization
- Dockerized Kafka and ZooKeeper
- Full-Stack React + FastAPI Integration
- Git and GitHub based Collaboration

---

# 🛠 Technologies Used

## Backend

- Python 3.11
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib / Bcrypt

## Frontend

- React.js
- React Router DOM
- Axios
- Recharts
- CSS

## Database

- SQLite
- SQLAlchemy ORM

## Event Streaming

- Apache Kafka
- ZooKeeper
- kafka-python
- Confluent Kafka

## Stream Processing

- Bytewax
- Time-Based Windows
- Event Counting
- Timestamp Processing

## Persistent State

- RocksDB
- rocksdict

## Monitoring

- Prometheus
- Grafana
- FastAPI Metrics Endpoint
- System Health Monitoring

## DevOps

- Docker
- Docker Compose

## Version Control

- Git
- GitHub

---

# 📂 Project Structure

```text
StreamForge
│
├── backend
│   │
│   ├── app
│   │   │
│   │   ├── api
│   │   │   ├── routes.py
│   │   │   ├── user_routes.py
│   │   │   ├── stream_routes.py
│   │   │   ├── stats_routes.py
│   │   │   └── health_routes.py
│   │   │
│   │   ├── core
│   │   │   └── database.py
│   │   │
│   │   ├── models
│   │   │   ├── user.py
│   │   │   ├── stream.py
│   │   │   └── stat.py
│   │   │
│   │   ├── schemas
│   │   │   ├── user.py
│   │   │   ├── stream.py
│   │   │   └── stat.py
│   │   │
│   │   ├── services
│   │   │   ├── auth.py
│   │   │   ├── dependencies.py
│   │   │   ├── kafka_manager.py
│   │   │   ├── kafka_service.py
│   │   │   ├── metrics_service.py
│   │   │   ├── processing_monitor.py
│   │   │   ├── rocksdb_service.py
│   │   │   ├── stats_service.py
│   │   │   ├── stream_service.py
│   │   │   ├── token_service.py
│   │   │   └── user_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── workers
│   │   └── kafka_stream_processor.py
│   │
│   └── requirements.txt
│
├── frontend
│   │
│   ├── public
│   │
│   └── src
│       │
│       ├── components
│       │   ├── CreateStream.jsx
│       │   ├── GrafanaDashboard.jsx
│       │   ├── Navbar.jsx
│       │   └── SystemHealth.jsx
│       │
│       ├── pages
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CreateStream.jsx
│       │   ├── EditStream.jsx
│       │   ├── Topology.jsx
│       │   └── NotFound.jsx
│       │
│       ├── routes
│       │   └── ProtectedRoute.jsx
│       │
│       ├── services
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── healthService.js
│       │   ├── statsService.js
│       │   ├── streamService.js
│       │   └── userService.js
│       │
│       └── styles
│           ├── CreateStream.css
│           ├── Dashboard.css
│           ├── Login.css
│           ├── Register.css
│           └── Topology.css
│
├── kafka
│   └── docker-compose.yml
│
├── data
│   └── rocksdb
│
├── .gitignore
└── README.md

🏗 System Architecture
                         ┌─────────────────────┐
                         │   React Frontend    │
                         │                     │
                         │ Login / Dashboard   │
                         │ Streams / Stats     │
                         │ Topology / Grafana  │
                         └──────────┬──────────┘
                                    │
                              HTTP / Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FastAPI Backend   │
                         │                     │
                         │ JWT Authentication  │
                         │ Stream CRUD APIs    │
                         │ Stats APIs          │
                         │ Health APIs         │
                         │ Prometheus Metrics  │
                         └──────┬───────┬──────┘
                                │       │
                     SQLite     │       │ Kafka Producer
                                │       │
                                ▼       ▼
                         ┌──────────┐  ┌───────────────┐
                         │  SQLite  │  │ Apache Kafka  │
                         │ Database │  │               │
                         └──────────┘  │ stream-events │
                                       └───────┬───────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │     Bytewax      │
                                    │ Stream Processor │
                                    └────────┬─────────┘
                                             │
                         ┌───────────────────┼───────────────────┐
                         │                   │                   │
                         ▼                   ▼                   ▼
                  Event Processing    Window Counting     Processing Monitor
                         │                   │                   │
                         └───────────────────┼───────────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │   RocksDB   │
                                      │ Persistent  │
                                      │ Window Data │
                                      └──────┬──────┘
                                             │
                                             ▼
                                      FastAPI Stats API
                                             │
                                             ▼
                                      React Statistics
                                             │
                                             ▼
                                      Grafana Dashboard
🔄 End-to-End Data Flow

The complete StreamForge event-processing workflow is:

User
  │
  ▼
React Frontend
  │
  ▼
Login / JWT Authentication
  │
  ▼
FastAPI Backend
  │
  ├──────────────► SQLite Database
  │
  ▼
Stream Creation
  │
  ▼
Kafka Producer
  │
  ▼
Kafka Topic
"stream-events"
  │
  ▼
Bytewax Processor
  │
  ├── Event Validation
  │
  ├── Timestamp Processing
  │
  ├── Event Processing
  │
  └── Window Counting
          │
          ▼
       RocksDB
          │
          ▼
    Statistics API
          │
          ▼
    React Dashboard
          │
          ▼
    Statistics Graph

Monitoring flow:

FastAPI
   │
   ▼
/metrics
   │
   ▼
Prometheus
   │
   ▼
Grafana
   │
   ▼
StreamForge Monitoring Dashboard
🔐 Authentication

StreamForge uses JWT-based authentication.

The authentication workflow is:

Register
   ↓
User Stored in SQLite
   ↓
Login
   ↓
JWT Token Generated
   ↓
Token Stored by Frontend
   ↓
Protected API Requests

Protected routes require a valid JWT token.

Authentication includes:

User Registration
User Login
Password Hashing
JWT Token Generation
JWT Token Validation
Protected API Routes
🌊 Stream Management

Authenticated users can manage their streams through the dashboard.

Available operations:

Create Stream
View Streams
Update Stream
Delete Stream

Each stream contains information such as:

Stream ID
Title
Description
Owner ID

When a stream is created, the backend stores it in SQLite and publishes a corresponding event to Kafka.

📡 Kafka Integration

Kafka is used as the event streaming layer of StreamForge.

Whenever a stream is created, the backend generates an event and publishes it to the Kafka topic:

stream-events

Example event:

{
    "event": "stream_created",
    "stream_id": 7,
    "title": "Live Test Stream",
    "owner_id": 2,
    "timestamp": "2026-08-13T05:55:32.781349+00:00"
}

Kafka provides the communication layer between the FastAPI backend and the Bytewax processing pipeline.

⚙️ Bytewax Processing

Bytewax is responsible for real-time stream processing.

The processor:

Reads events from Kafka.
Validates event information.
Processes timestamps.
Marks events as processed.
Groups events into time-based windows.
Counts events inside each window.
Saves window statistics into RocksDB.
Updates processing-monitor information.

Example processing output:

streamforge_processor.raw-events

streamforge_processor.processed-events

streamforge_processor.window-count

streamforge_processor.saved-stats

Example:

window-count:
{
    "key": "2",
    "window_id": 3874986,
    "total_events": 1
}
💾 RocksDB Persistent State

StreamForge uses RocksDB through rocksdict for persistent processing state.

Window statistics are stored using keys such as:

window:<owner_id>:<window_id>

Example:

window:2:3874986

Stored information includes:

{
    "owner_id": 2,
    "window_id": "3874986",
    "total_events": 1
}

This allows processed window statistics to persist independently of the React frontend.

📊 Statistics Dashboard

The StreamForge dashboard provides real-time processing information including:

Total Events
Active Streams
Statistics Windows
Latest Window Events
Processor Status
Processed Events
Last Processing Window
Window Event Count
Last Processed Event
Last Event Time

The dashboard also provides a bar chart for window-based event statistics.

❤️ System Health Monitoring

StreamForge includes a system health monitoring component.

The dashboard monitors backend and processing availability.

The backend exposes health-related APIs that allow the frontend to determine whether core services are available.

The processing monitor tracks information such as:

Processor Status
Processed Events
Last Event
Last Event Time
Last Window ID
Last Window Count
📈 Prometheus Monitoring

Prometheus is used for collecting application metrics from the FastAPI backend.

The backend exposes metrics through:

http://127.0.0.1:8001/metrics

Prometheus scrapes the backend metrics endpoint.

Example metric:

streamforge_events_processed_total

Prometheus target:

streamforge-backend

The monitoring pipeline is:

FastAPI
   ↓
/metrics
   ↓
Prometheus
   ↓
Grafana
📉 Grafana Dashboard

Grafana is integrated into the StreamForge dashboard for monitoring real-time application metrics.

Grafana runs on:

http://localhost:3001

The StreamForge frontend embeds the Grafana dashboard directly into the Dashboard page.

The Grafana monitoring dashboard can display metrics such as:

Total Events Processed
Event Processing Rate
Stream Processing Metrics
Backend Metrics
Real-Time Monitoring Information

Grafana is configured with anonymous Viewer access for embedded dashboard usage.

🕸 Stream Topology

StreamForge contains a dedicated topology visualization page.

The topology represents the major components of the event-processing pipeline:

React
  ↓
FastAPI
  ↓
Kafka
  ↓
Bytewax
  ↓
RocksDB
  ↓
Statistics
  ↓
Prometheus
  ↓
Grafana

This helps users understand the architecture and data flow of the platform.

🐳 Docker Setup

Kafka, ZooKeeper, Prometheus and Grafana are containerized using Docker.

Kafka services are configured through:

kafka/docker-compose.yml

Start the services:

cd kafka
docker compose up -d

Check running containers:

docker ps

Expected services include:

kafka
zookeeper
streamforge-prometheus
streamforge-grafana

Kafka broker:

127.0.0.1:9092

Prometheus:

http://localhost:9090

Grafana:

http://localhost:3001
▶️ Running the Project
1. Start Kafka, ZooKeeper, Prometheus and Grafana

Open PowerShell from the project root:

cd kafka
docker compose up -d

Verify the containers:

docker ps
2. Activate Python Environment

From the project root:

cd ..
.\.venv\Scripts\Activate.ps1
3. Start FastAPI Backend

From the project root:

python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8001

Backend:

http://127.0.0.1:8001

Swagger documentation:

http://127.0.0.1:8001/docs

Metrics:

http://127.0.0.1:8001/metrics
4. Start Bytewax Processor

Open another PowerShell terminal from the project root:

.\.venv\Scripts\Activate.ps1
python -m bytewax.run backend.workers.kafka_stream_processor

The processor consumes events from:

stream-events
5. Start React Frontend

Open another terminal:

cd frontend
npm start

Frontend:

http://localhost:3000
🧪 End-to-End Testing

A complete StreamForge test can be performed using the following sequence:

1. Start Docker Services
       ↓
2. Start FastAPI
       ↓
3. Start Bytewax
       ↓
4. Start React
       ↓
5. Register User
       ↓
6. Login
       ↓
7. Create Stream
       ↓
8. Kafka Event Generated
       ↓
9. Bytewax Processes Event
       ↓
10. Window Statistics Generated
       ↓
11. RocksDB Stores Statistics
       ↓
12. Statistics API Returns Data
       ↓
13. React Dashboard Updates
       ↓
14. Prometheus Collects Metrics
       ↓
15. Grafana Displays Metrics
🔍 Monitoring Verification
Prometheus Targets

Open:

http://localhost:9090/targets

The StreamForge backend target should show:

streamforge-backend
UP
Prometheus Query

Example query:

streamforge_events_processed_total
Grafana

Open:

http://localhost:3001

Grafana is used for application and event-processing monitoring.

🧭 Application Pages

StreamForge currently provides the following major frontend pages:

Home

Landing page of the application.

Register

Allows new users to create an account.

Login

Authenticates users using JWT authentication.

Dashboard

Provides:

Stream Management
Processing Monitor
Statistics
Statistics Graph
System Health
Grafana Monitoring
Create Stream

Allows authenticated users to create a new stream.

Edit Stream

Allows users to update existing stream information.

Topology

Displays the StreamForge processing architecture and event flow.

Not Found

Handles invalid application routes.

👥 Team
Ayush Patel — Project Lead
Responsibilities
Backend Development
FastAPI API Development
JWT Authentication
User Management
Stream CRUD Operations
SQLite Database Integration
Apache Kafka Integration
Kafka Producer
Kafka Event Workflow
Bytewax Integration
Real-Time Event Processing
Event Timestamp Processing
Event Windowing
Event Counting
RocksDB Integration
Processing Monitoring
Prometheus Integration
Grafana Integration
React Dashboard Integration
System Health Monitoring
Stream Topology
GitHub Repository Management
Pull Request Review
Final Integration
End-to-End Testing
Poojitha — Frontend Development
Responsibilities
Login Page
Registration Page
React Components
Dashboard UI
Form Validation
Axios API Integration
Responsive UI
Ramya — Dashboard & Visualization
Responsibilities
Dashboard Design
UI Components
Stream Visualization
Dashboard Improvements
Statistics Visualization
Kavya — Documentation
Responsibilities
README Documentation
API Documentation
PPT Preparation
Project Report
🌿 Git Workflow

Create a feature branch:

git checkout -b feature-name

Check changes:

git status

Add changes:

git add .

Commit changes:

git commit -m "Added Feature"

Push branch:

git push origin feature-name

After review, merge the feature branch into the main branch.

📌 Important Git Commands

Check repository status:

git status

View commits:

git log --oneline --decorate -5

Check remote:

git remote -v

Pull latest changes:

git pull origin main

Push latest changes:

git push origin main
✅ Current Working Features
Authentication
✅ User Registration
✅ User Login
✅ JWT Authentication
✅ Protected APIs
✅ Password Hashing
Stream Management
✅ Stream Creation
✅ Stream Listing
✅ Stream Update
✅ Stream Deletion
✅ User-Owned Streams
Backend
✅ FastAPI
✅ SQLAlchemy
✅ SQLite
✅ REST APIs
✅ Health APIs
✅ Statistics APIs
✅ Processing Monitor
✅ Metrics Endpoint
Kafka
✅ Kafka Producer
✅ Kafka Topic
✅ Kafka Event Publishing
✅ Kafka → Bytewax Integration
✅ Dockerized Kafka
✅ Dockerized ZooKeeper
Bytewax
✅ Real-Time Event Processing
✅ Timestamp Processing
✅ Event Validation
✅ Time-Based Windowing
✅ Event Counting
✅ Processed Event Tracking
✅ Window Statistics
Persistent Processing
✅ RocksDB Integration
✅ Window Statistics Storage
✅ Persistent Processing State
Monitoring
✅ Prometheus
✅ FastAPI Metrics
✅ Prometheus Scraping
✅ Grafana
✅ Grafana Embedded Dashboard
✅ System Health Monitoring
✅ Processing Status Monitoring
Frontend
✅ React Dashboard
✅ JWT Login/Register
✅ Stream CRUD
✅ Statistics Cards
✅ Statistics Bar Chart
✅ Live Processing Monitor
✅ System Health
✅ Grafana Monitoring
✅ Stream Topology Visualization
✅ Protected Routes
Infrastructure
✅ Docker
✅ Docker Compose
✅ Kafka
✅ ZooKeeper
✅ Prometheus
✅ Grafana
✅ Git
✅ GitHub
🔗 Service URLs
Service	URL
React Frontend	http://localhost:3000
FastAPI Backend	http://127.0.0.1:8001
Swagger API Docs	http://127.0.0.1:8001/docs
Metrics	http://127.0.0.1:8001/metrics
Prometheus	http://localhost:9090
Prometheus Targets	http://localhost:9090/targets
Grafana	http://localhost:3001
Kafka	127.0.0.1:9092
ZooKeeper	127.0.0.1:2181
🎯 Final Architecture

StreamForge demonstrates a complete modern event-driven architecture:

                 ┌──────────────────┐
                 │   React.js UI    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  FastAPI Backend │
                 └──────┬─────┬─────┘
                        │     │
                 ┌──────▼─┐   ▼
                 │ SQLite │ Kafka
                 └────────┘   │
                              ▼
                       ┌──────────────┐
                       │   Bytewax    │
                       └──────┬───────┘
                              │
                    ┌─────────▼─────────┐
                    │ Event Processing  │
                    │ Window Counting   │
                    └─────────┬─────────┘
                              │
                              ▼
                         ┌─────────┐
                         │ RocksDB │
                         └────┬────┘
                              │
                              ▼
                       Statistics API
                              │
                              ▼
                       React Dashboard


              Monitoring Pipeline

FastAPI ──► Prometheus ──► Grafana
   │                           │
   └──── Metrics ──────────────┘
🚀 StreamForge

A complete Real-Time Stream Processing Platform built with modern full-stack, event-driven, stream-processing and monitoring technologies.

📄 License

This project is developed for educational purposes as a team project demonstrating full-stack development and real-time event processing using:

FastAPI
React.js
SQLite
JWT Authentication
Apache Kafka
Bytewax
RocksDB
Prometheus
Grafana
Docker
Git
GitHub