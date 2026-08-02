# API Documentation

## StreamForge REST APIs

This document describes the REST APIs available in the StreamForge project.

---

# Base URL

```
http://127.0.0.1:8001
```

---

# Authentication

The project uses **JWT (JSON Web Token)** authentication.

Protected APIs require the following header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 1. User Registration

## Endpoint

```
POST /users/register
```

### Description

Registers a new user.

### Request Body

```json
{
  "username": "Ayush",
  "email": "ayush@gmail.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "message": "User registered successfully"
}
```

---

# 2. User Login

## Endpoint

```
POST /users/token
```

### Description

Authenticates the user and generates a JWT access token.

### Request Body

```json
{
  "username": "Ayush",
  "password": "123456"
}
```

### Success Response

```json
{
  "access_token": "JWT_TOKEN"
}
```

---

# 3. Create Stream

## Endpoint

```
POST /streams/create
```

### Description

Creates a new stream for the authenticated user.

### Request Body

```json
{
  "title": "My First Stream",
  "description": "Testing Stream"
}
```

### Success Response

```json
{
  "message": "Stream created successfully"
}
```

---

# 4. Get Streams

## Endpoint

```
GET /streams/
```

### Description

Returns all available streams.

---

# 5. Update Stream

## Endpoint

```
PUT /streams/{stream_id}
```

### Description

Updates an existing stream.

### Example Request

```json
{
  "title": "Updated Stream",
  "description": "Updated Description"
}
```

---

# 6. Delete Stream

## Endpoint

```
DELETE /streams/{stream_id}
```

### Description

Deletes a stream by its ID.

---

# Error Responses

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# API Workflow

```
User
   │
   ▼
Register
   │
   ▼
Login
   │
   ▼
Receive JWT Token
   │
   ▼
Access Protected APIs
   │
   ▼
Create / Read / Update / Delete Streams
```

---

# Notes

- JWT authentication is required for protected endpoints.
- All requests and responses use JSON format.
- API testing can be performed using Swagger UI or Postman.