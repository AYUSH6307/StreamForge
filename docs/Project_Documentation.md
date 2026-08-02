# StreamForge Project Documentation

## 1. Introduction

StreamForge is a Real-Time Stream Processing Platform designed to demonstrate modern backend development, event-driven architecture, and real-time data streaming using Apache Kafka. The project enables users to securely create and manage streams while showcasing scalable software architecture and team collaboration.

---

## 2. Project Objective

The objectives of StreamForge are:

- Implement secure user authentication using JWT.
- Develop REST APIs using FastAPI.
- Manage user and stream data using SQLite.
- Integrate Apache Kafka for event-driven communication.
- Demonstrate Docker-based deployment.
- Learn collaborative software development using Git and GitHub.

---

## 3. Technologies Used

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

### Database
- SQLite

### Event Streaming
- Apache Kafka
- ZooKeeper

### Frontend
- React.js
- Vite
- Axios
- CSS

### Containerization
- Docker
- Docker Compose

### Version Control
- Git
- GitHub

---

## 4. System Architecture

The application follows this workflow:

User → FastAPI Backend → SQLite Database → Kafka Producer → Kafka Topic → Kafka Consumer

---

## 5. Project Structure

The project contains the following modules:

- backend/
- frontend/
- kafka/
- monitoring/
- docs/
- tests/

---

## 6. Features

### Completed
- User Registration
- User Login
- JWT Authentication
- Stream CRUD Operations
- SQLite Database Integration
- Kafka Producer
- Kafka Consumer
- Docker Setup

### In Progress
- React Frontend
- Dashboard
- Documentation
- Monitoring

---

## 7. Team Responsibilities

| Member | Responsibility |
|---------|----------------|
| Ayush Patel | Backend Development & Project Lead |
| Poojitha | Frontend Development |
| Ramya | Dashboard Visualization |
| Nishun | IoT Data Producer |
| Kavya Bandaru | Documentation & Research |

---

## 8. Future Enhancements

- Stream Analytics
- Bytewax/Faust Integration
- RocksDB State Management
- Prometheus Monitoring
- Deployment
- Notifications

---

## 9. Conclusion

StreamForge demonstrates a complete real-time stream management platform by combining authentication, REST APIs, databases, Apache Kafka, and a modern React frontend. The project follows collaborative development practices using Git and GitHub while providing a scalable foundation for future enhancements.