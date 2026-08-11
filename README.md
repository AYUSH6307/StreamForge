# 🚀 StreamForge

## Real-Time Stream Management Platform

StreamForge is a full-stack **Real-Time Stream Management Platform** built using **FastAPI, React.js, SQLite, JWT Authentication, Apache Kafka, and Bytewax**.

The platform allows authenticated users to register, log in, and create and manage streams. Stream creation generates events that are published to Apache Kafka and processed in real time using Bytewax.

---

# 📌 Project Objective

The main objectives of StreamForge are:

* User Registration and Login
* JWT-based Authentication
* Protected REST APIs
* Stream CRUD Operations
* SQLite Database Management
* Apache Kafka Integration
* Kafka Producer and Consumer Workflow
* Real-Time Event Processing using Bytewax
* Time-Based Event Windowing
* Event Counting
* Dockerized Kafka and ZooKeeper Services
* Full-Stack React + FastAPI Integration
* Git and GitHub based Team Collaboration

---

# 🛠 Technologies Used

## Backend

* Python 3.11
* FastAPI
* Uvicorn
* SQLAlchemy
* Pydantic
* JWT Authentication
* Passlib / Bcrypt

## Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap
* CSS

## Database

* SQLite
* SQLAlchemy ORM

## Event Streaming & Processing

* Apache Kafka
* ZooKeeper
* kafka-python
* Confluent Kafka
* Bytewax

## DevOps

* Docker
* Docker Compose

## Version Control

* Git
* GitHub

---

# 📂 Project Structure

```text
StreamForge
│
├── backend
│   │
│   ├── app
│   │   ├── api
│   │   │   ├── routes.py
│   │   │   ├── user_routes.py
│   │   │   └── stream_routes.py
│   │   │
│   │   ├── core
│   │   │   └── database.py
│   │   │
│   │   ├── models
│   │   │   ├── user.py
│   │   │   └── stream.py
│   │   │
│   │   ├── schemas
│   │   │   ├── user.py
│   │   │   └── stream.py
│   │   │
│   │   ├── services
│   │   │   ├── auth.py
│   │   │   ├── kafka_manager.py
│   │   │   ├── kafka_service.py
│   │   │   ├── token_service.py
│   │   │   ├── user_service.py
│   │   │   └── dependencies.py
│   │   │
│   │   └── main.py
│   │
│   ├── workers
│   │   ├── kafka_stream_processor.py
│   │   └── stream_processor.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── routes
│       ├── services
│       └── styles
│
├── kafka
│   └── docker-compose.yml
│
├── docs
├── tests
└── README.md
```

---

# 🏗 System Architecture

```text
                 React Frontend
                       │
                       │ HTTP / Axios
                       ▼
                FastAPI Backend
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
       SQLite Database      Kafka Producer
                                 │
                                 ▼
                         Kafka Topic
                       "stream-events"
                                 │
                                 ▼
                         Bytewax Processor
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
              Event Processing         Window Counting
                    │                         │
                    └────────────┬────────────┘
                                 ▼
                         Processed Events
```

---

# 🔐 Authentication

StreamForge implements JWT-based authentication.

### Authentication Flow

```text
User
 │
 ├── Register
 │      ↓
 │   FastAPI
 │      ↓
 │   SQLite
 │
 └── Login
        ↓
   Verify Credentials
        ↓
   Generate JWT Token
        ↓
   React stores Token
        ↓
   Protected API Requests
```

Protected endpoints require a valid JWT token.

---

# 🌊 Stream Management

Authenticated users can manage streams through REST APIs.

### Supported Operations

* Create Stream
* Get All Streams
* Get Individual Stream
* Get Current User's Streams
* Update Stream
* Delete Stream

Example stream:

```json
{
  "title": "Kafka Integrated Stream",
  "description": "Real-time stream processing test"
}
```

---

# ⚡ Kafka Integration

Apache Kafka is used as the event streaming layer of StreamForge.

When a stream is created:

```text
Stream Creation
      ↓
FastAPI Backend
      ↓
Kafka Producer
      ↓
stream-events Topic
```

The Kafka topic used by the project is:

```text
stream-events
```

Kafka and ZooKeeper are configured using Docker Compose.

---

# 🔄 Bytewax Real-Time Processing

Bytewax is used to process Kafka events in real time.

The processing pipeline performs:

1. Kafka event consumption
2. JSON decoding
3. Event validation
4. Timestamp parsing
5. Event processing
6. Time-based windowing
7. Event counting

### Bytewax Flow

```text
Kafka
  ↓
Kafka Input
  ↓
JSON Decode
  ↓
Event Validation
  ↓
Timestamp Parsing
  ↓
Event Processing
  ↓
5-Second Tumbling Window
  ↓
Event Count
```

Example processed event:

```json
{
  "event": "stream_created",
  "stream_id": 1,
  "title": "Kafka Integrated",
  "owner_id": 2,
  "processed": true
}
```

---

# 📊 Window-Based Event Processing

StreamForge uses a **5-second tumbling window** for event counting.

The Bytewax processor groups incoming events into fixed time windows and calculates the number of events received in each window.

Example:

```text
Window
  │
  ├── Event 1
  ├── Event 2
  └── Event 3
        ↓
Total Events = 3
```

This demonstrates real-time stream aggregation.

---

# 🐳 Kafka Docker Setup

Kafka and ZooKeeper are containerized using Docker Compose.

Start the services:

```bash
cd kafka
docker compose up -d
```

Check running containers:

```bash
docker ps
```

The Kafka broker runs on:

```text
127.0.0.1:9092
```

The project Kafka topic is:

```text
stream-events
```

---

# ▶️ Running the Project

## 1. Start Kafka

```bash
cd kafka
docker compose up -d
```

---

## 2. Start Backend

Activate the Python environment and run:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Backend:

```text
http://127.0.0.1:8001
```

Swagger API documentation:

```text
http://127.0.0.1:8001/docs
```

---

## 3. Start Bytewax Processor

From the project root:

```bash
python -m bytewax.run backend.workers.kafka_stream_processor
```

The processor consumes events from:

```text
stream-events
```

and performs real-time processing and window-based counting.

---

## 4. Start Frontend

```bash
cd frontend
npm start
```

Frontend:

```text
http://localhost:3000
```

---

# 🔗 End-to-End Workflow

The complete StreamForge workflow is:

```text
User
  ↓
React Frontend
  ↓
Login / JWT Authentication
  ↓
FastAPI Backend
  ↓
Stream Creation
  ↓
SQLite Database
  ↓
Kafka Producer
  ↓
Kafka: stream-events
  ↓
Bytewax
  ↓
Event Validation
  ↓
Timestamp Processing
  ↓
5-Second Window
  ↓
Event Count
```

This demonstrates a complete **event-driven real-time processing architecture**.

---

# 👥 Team

## Ayush Patel — Project Lead

### Responsibilities

* Backend Development
* FastAPI API Development
* JWT Authentication
* Stream CRUD Operations
* Apache Kafka Integration
* Bytewax Integration
* GitHub Repository Management
* Pull Request Review
* Final Integration
* Testing

---

## Poojitha — Frontend Development

### Responsibilities

* Login Page
* Registration Page
* Dashboard UI
* React Components
* Form Validation
* Axios API Integration
* Responsive UI

---

## Ramya — Dashboard & Visualization

### Responsibilities

* Dashboard Design
* UI Components
* Stream Visualization
* Dashboard Improvements

---

## Nishun — Kafka Module

### Responsibilities

* Kafka Producer
* Stream Events
* Kafka Event Testing
* Event Integration

---

## Kavya — Documentation

### Responsibilities

* README Documentation
* API Documentation
* PPT Preparation
* Project Reports

---

# 🌿 Git Workflow

Create a feature branch:

```bash
git checkout -b feature-name
```

Add changes:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Added Feature"
```

Push the branch:

```bash
git push origin feature-name
```

The Project Lead reviews changes before merging them into the `main` branch.

---

# 🧪 Current Working Features

The following features have been implemented and tested:

* ✅ User Registration
* ✅ User Login
* ✅ JWT Authentication
* ✅ Protected APIs
* ✅ Stream Creation
* ✅ Stream Listing
* ✅ Stream Update
* ✅ Stream Deletion
* ✅ SQLite Database
* ✅ React Frontend
* ✅ FastAPI Backend
* ✅ Axios API Integration
* ✅ Kafka Producer
* ✅ Kafka Topic
* ✅ Kafka Consumer Integration
* ✅ Bytewax Processing
* ✅ Timestamp Processing
* ✅ 5-Second Event Windowing
* ✅ Event Counting
* ✅ Dockerized Kafka & ZooKeeper
* ✅ End-to-End Frontend → Backend → Kafka → Bytewax Flow

---

# 📄 License

This project is developed for **educational purposes** as a team project demonstrating full-stack development and real-time event processing using FastAPI, React.js, SQLite, JWT Authentication, Apache Kafka, Bytewax, Docker, and GitHub.
