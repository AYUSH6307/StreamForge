# StreamForge
Real-Time Stream Processing Platform using Apache Kafka, Bytewax/Faust, RocksDB, Prometheus and React

# 🚀 StreamForge

## Real-Time Stream Management Platform

StreamForge is a Real-Time Stream Management Platform built using FastAPI, SQLite, JWT Authentication and Apache Kafka.

The goal of this project is to provide a secure and scalable platform where users can create and manage streams while demonstrating modern backend architecture, event-driven systems, authentication, and real-time messaging using Kafka.

---

# 📌 Project Objective

The main objective of StreamForge is to learn and implement:

- User Authentication
- Secure APIs using JWT
- Database Management
- Stream CRUD Operations
- Event Driven Architecture
- Apache Kafka Integration
- Docker-based Service Deployment
- Team Collaboration using Git & GitHub

---

# 🏗️ System Architecture

```text
User
 │
 ▼
FastAPI Backend
 │
 ├── Authentication (JWT)
 │
 ├── Stream Management APIs
 │
 ▼
SQLite Database
 │
 ▼
Kafka Producer
 │
 ▼
Kafka Topic
 │
 ▼
Kafka Consumer
```

---

# 🛠 Technologies Used

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

## Database

- SQLite

## Event Streaming

- Apache Kafka
- Zookeeper

## Containerization

- Docker
- Docker Compose

## Version Control

- Git
- GitHub

## Frontend (Upcoming)

- React.js
- Bootstrap
- Axios

---

# 📂 Project Structure

```text
StreamForge
│
├── backend
│   │
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── kafka
│   └── docker-compose.yml
│
├── frontend          (Upcoming)
│
├── docs              (Documentation)
│
├── tests             (Testing)
│
└── README.md
```

---

# 📖 Understanding The Project

Before contributing, every team member should understand the following flow:

## Step 1 - User Registration

A new user registers using:

```http
POST /users/register
```

Example:

```json
{
  "username": "Ayush",
  "email": "ayush@gmail.com",
  "password": "123456"
}
```

The user data is stored in the database.

---

## Step 2 - User Login

The user logs in using:

```http
POST /users/token
```

The system verifies credentials and generates a JWT Token.

Example Response:

```json
{
  "access_token": "JWT_TOKEN"
}
```

---

## Step 3 - Authorization

Protected APIs require JWT token.

The token is verified inside:

```text
app/services/dependencies.py
```

Flow:

```text
Token
 ↓
JWT Decode
 ↓
Find User
 ↓
Allow Access
```

---

## Step 4 - Stream Creation

Authenticated users can create streams.

API:

```http
POST /streams/create
```

Example:

```json
{
  "title": "My First Stream",
  "description": "Testing Stream"
}
```

The stream is stored in the database.

---

# 🔥 Kafka Integration

One of the most important parts of this project.

When a stream is created:

```text
Create Stream
      ↓
Save In Database
      ↓
Kafka Producer Sends Event
      ↓
Kafka Topic Receives Event
      ↓
Kafka Consumer Reads Event
```

---

## Kafka Producer

File:

```text
app/services/kafka_service.py
```

Purpose:

Sends events to Kafka.

Example Event:

```json
{
  "event_type": "stream_created",
  "data": {
    "stream_id": 1,
    "title": "Test Stream",
    "owner_id": 2
  }
}
```

---

## Kafka Consumer

File:

```text
app/services/kafka_consumer.py
```

Purpose:

Listens for events continuously.

Example Output:

```text
Received Event:
{
  "event_type": "stream_created",
  "data": {
    "stream_id": 1,
    "title": "Test Stream",
    "owner_id": 2
  }
}
```

---

# 🗄 Database Design

## Users Table

Stores:

- User ID
- Username
- Email
- Password

Model:

```text
app/models/user.py
```

---

## Streams Table

Stores:

- Stream ID
- Title
- Description
- Owner ID

Model:

```text
app/models/stream.py
```

---

# 📚 Important Files

Every contributor should understand these files first.

---

## main.py

```text
app/main.py
```

Project entry point.

Loads:

- User Routes
- Stream Routes

---

## database.py

```text
app/core/database.py
```

Responsible for:

- Database Connection
- Session Creation
- Engine Setup

---

## user_routes.py

```text
app/api/user_routes.py
```

Contains:

- Register API
- Login API

---

## stream_routes.py

```text
app/api/stream_routes.py
```

Contains:

- Create Stream
- Read Stream
- Update Stream
- Delete Stream
- My Streams

---

## stream_service.py

```text
app/services/stream_service.py
```

Contains actual business logic for stream operations.

---

## token_service.py

```text
app/services/token_service.py
```

Responsible for:

- JWT Creation
- JWT Verification

---

## kafka_service.py

```text
app/services/kafka_service.py
```

Kafka Producer Implementation.

---

## kafka_consumer.py

```text
app/services/kafka_consumer.py
```

Kafka Consumer Implementation.

---

# ✅ Features Completed

Currently completed:

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- SQLite Integration
- Stream CRUD
- Kafka Producer
- Kafka Consumer
- Docker Setup
- GitHub Integration

---

# 🔄 Features In Progress

Upcoming modules:

- React Frontend
- Dashboard
- Stream Analytics
- Notifications
- Testing Suite
- Deployment

---

# 👥 Team Responsibilities

## Ayush

- Backend Development
- Kafka Integration
- Final Project Integration

## Frontend Team

- React Setup
- UI Development
- API Integration

## Testing Team

- API Testing
- Bug Reporting

## Documentation Team

- Report Writing
- PPT Preparation
- Project Documentation

---

# 🚀 Running The Project

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

---

## Open Swagger

```text
http://127.0.0.1:8001/docs
```

---

## Start Kafka

```bash
docker compose up -d
```

---

# 📌 Contribution Rules

Before starting work:

```bash
git pull origin main
```

After completing work:

```bash
git add .
git commit -m "Your Changes"
git push origin main
```

Always test your code before pushing.

---

# Current Project Status

Backend Development Progress:

🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜

Approximate Completion: 80%

Frontend Development Progress:

⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

Approximate Completion: 0%

Overall Project Progress:

🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜

Approximate Completion: 60%






