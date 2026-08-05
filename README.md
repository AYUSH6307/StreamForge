# 🚀 StreamForge

## Real-Time Stream Management Platform

StreamForge is a full-stack Real-Time Stream Management Platform built using **FastAPI**, **React.js**, **SQLite**, **JWT Authentication**, and **Apache Kafka**.

The platform allows authenticated users to create, manage, update, and delete streams while demonstrating secure authentication, event-driven architecture, and modern full-stack development.

---

# 📌 Project Objective

The objectives of StreamForge are:

- User Registration & Login
- JWT Authentication
- Protected REST APIs
- Stream CRUD Operations
- Apache Kafka Integration
- Event-Driven Architecture
- Dockerized Kafka Services
- Team Collaboration using Git & GitHub

---

# 🛠 Technologies Used

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

## Frontend

- React.js
- React Router DOM
- Axios
- Bootstrap
- CSS

## Database

- SQLite

## Event Streaming

- Apache Kafka
- ZooKeeper

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
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   └── main.py
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── styles
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
                      ▼
               FastAPI Backend
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    SQLite Database         Kafka Producer
                                  │
                                  ▼
                             Kafka Topic
                                  │
                                  ▼
                            Kafka Consumer
```

---

# 🔐 Authentication Flow

```text
User
 │
 ▼
Register
 │
 ▼
SQLite Database
 │
 ▼
Login
 │
 ▼
JWT Token Generated
 │
 ▼
Stored in Browser
 │
 ▼
Protected API Access
```

---

# 📚 API Endpoints

## User APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /users/register | Register User |
| POST | /users/login | Login User |
| GET | /users/me | Get Current User |
| PUT | /users/update | Update Profile |

---

## Stream APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /streams | Get All Streams |
| GET | /streams/my | Get My Streams |
| POST | /streams/create | Create Stream |
| GET | /streams/{id} | Get Stream By ID |
| PUT | /streams/{id} | Update Stream |
| DELETE | /streams/{id} | Delete Stream |

---

# 📊 Database Design

## Users Table

| Field | Type |
|------|------|
| id | Integer |
| username | String |
| email | String |
| password | String |

---

## Streams Table

| Field | Type |
|------|------|
| id | Integer |
| title | String |
| description | String |
| owner_id | Integer |

Relationship

```text
One User
     │
     ▼
Many Streams
```

---

# 🔥 Kafka Integration

Whenever a stream is created:

```text
Create Stream
      │
      ▼
Save to Database
      │
      ▼
Kafka Producer
      │
      ▼
Kafka Topic
      │
      ▼
Kafka Consumer
      │
      ▼
Event Processed
```

Producer File

```
backend/app/services/kafka_service.py
```

Consumer File

```
backend/app/services/kafka_consumer.py
```

---

# 💻 Frontend Features

- User Registration
- User Login
- JWT Authentication
- Protected Dashboard
- Create Stream
- View Streams
- Edit Stream
- Delete Stream
- Navbar with Logged-in User
- Logout

---

# ⚙ Backend Features

- FastAPI REST APIs
- SQLite Database
- SQLAlchemy ORM
- JWT Authentication
- User Management
- Stream CRUD Operations
- Kafka Producer
- Kafka Consumer
- Docker Integration
- Swagger Documentation

---

# 📌 Project Workflow

```text
User Registers
      │
      ▼
User Login
      │
      ▼
JWT Token Generated
      │
      ▼
Dashboard
      │
      ▼
Create Stream
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

# 🚀 Running The Project

## Clone Repository

```bash
git clone <repository-url>
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload --port 8001
```

Backend

```
http://127.0.0.1:8001
```

Swagger

```
http://127.0.0.1:8001/docs
```

---

## Kafka Setup

```bash
cd kafka

docker compose up -d
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm start
```

Frontend

```
http://localhost:3000
```

---

# ✅ Features Completed

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- SQLite Integration
- Stream CRUD Operations
- User Ownership Validation
- Kafka Producer
- Kafka Consumer
- Docker Setup
- React Frontend
- Dashboard
- Axios API Integration
- Swagger Documentation
- GitHub Version Control

---

# 🔄 Future Enhancements

- Stream Analytics Dashboard
- Live Kafka Monitoring
- Notifications
- PostgreSQL Migration
- Cloud Deployment
- Unit Testing
- Performance Monitoring

---

# 👥 Team Members

## 👨‍💻 Ayush Patel (Project Lead)

### Responsibilities

- Backend Development
- FastAPI API Development
- JWT Authentication
- Stream CRUD Operations
- Apache Kafka Integration
- GitHub Repository Management
- Pull Request Review
- Final Integration
- Testing & Deployment

---

## 👩 Poojitha

### Module

Frontend Development

### Responsibilities

- Login Page
- Registration Page
- Dashboard UI
- React Components
- Form Validation
- Axios API Integration
- Responsive UI Design

---

## 👩 Ramya

### Module

Dashboard Visualization

### Responsibilities

- Dashboard Design
- UI Components
- Stream Visualization
- Dashboard Improvements

---

## 👨 Nishun

### Module

Kafka Producer

### Responsibilities

- Kafka Producer
- Sample Stream Events
- Event Testing

---

## 👩 Kavya

### Module

Documentation

### Responsibilities

- README Documentation
- PPT Preparation
- API Documentation
- Project Reports

---

# 🌿 Git Workflow

Create a Branch

```bash
git checkout -b feature-name
```

Commit Changes

```bash
git add .

git commit -m "Added Feature"
```

Push Changes

```bash
git push origin feature-name
```

Project Lead reviews the Pull Request before merging into the main branch.

---

# 📄 License

This project is developed for educational purposes as a team project demonstrating modern full-stack application development using FastAPI, React.js, JWT Authentication, SQLite, Apache Kafka, Docker, and GitHub.