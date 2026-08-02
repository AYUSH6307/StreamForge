# Installation Guide

## StreamForge Setup Guide

This document explains how to install, configure, and run the StreamForge project.

---

# Prerequisites

Before running the project, make sure the following software is installed:

- Python 3.10 or later
- Node.js and npm
- Git
- Docker
- Docker Compose

---

# Clone the Repository

```bash
git clone <repository-url>
cd StreamForge
```

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

---

# Kafka Setup

Navigate to the Kafka directory:

```bash
cd kafka
```

Start Kafka services:

```bash
docker compose up -d
```

Verify running containers:

```bash
docker ps
```

---

# Swagger API Documentation

After starting the backend, open:

```
http://127.0.0.1:8001/docs
```

Swagger UI can be used to test all available APIs.

---

# Project Structure

```
StreamForge
│
├── backend
├── frontend
├── kafka
├── monitoring
├── docs
├── tests
└── README.md
```

---

# Stopping the Project

Stop the backend server using:

```
Ctrl + C
```

Stop Docker containers:

```bash
docker compose down
```

---

# Troubleshooting

### Backend not starting

- Check whether Python dependencies are installed.
- Verify that the required port is available.

### Frontend not starting

- Run `npm install`.
- Check the Node.js version.

### Kafka issues

- Ensure Docker Desktop is running.
- Verify that Docker containers have started successfully.

---

# Conclusion

Following the above steps will set up the StreamForge application locally, allowing developers to run the backend, frontend, Kafka services, and test the APIs using Swagger UI.