# Stage 1 – Campus Notification System REST API Design

## Overview

The Campus Notification System is a RESTful application that allows authenticated students to receive notifications related to placements, events, examination results, workshops, and general announcements. The platform also supports real-time notifications so users receive updates instantly.

# Base URL

http://localhost:5000/api

# Authentication

All endpoints except the login endpoint require a valid JWT access token.

### Request Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

# Notification Schema

```json
{
  "id": 1,
  "title": "Placement Drive",
  "message": "Infosys Campus Drive on Friday at 10:00 AM.",
  "notificationType": "Placement",
  "priority": "High",
  "createdBy": "Placement Cell",
  "isRead": false,
  "createdAt": "2026-07-02T10:00:00Z"
}
```

# REST API Endpoints

## 1. User Login

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "student@college.edu",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "token": "jwt-access-token",
  "user": {
    "id": 101,
    "name": "John Doe",
    "email": "student@college.edu"
  }
}
```

---

## 2. Get All Notifications

### Endpoint

```http
GET /api/notifications
```

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Response

```json
{
  "success": true,
  "message": "Notifications fetched successfully.",
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Placement Drive",
      "notificationType": "Placement",
      "priority": "High",
      "isRead": false
    },
    {
      "id": 2,
      "title": "Workshop Registration",
      "notificationType": "Event",
      "priority": "Medium",
      "isRead": true
    }
  ]
}
```

---

## 3. Get Notification by ID

### Endpoint

```http
GET /api/notifications/{id}
```

### Example

```http
GET /api/notifications/1
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Placement Drive",
    "message": "Infosys Campus Drive on Friday at 10:00 AM.",
    "notificationType": "Placement",
    "priority": "High",
    "createdBy": "Placement Cell",
    "isRead": false,
    "createdAt": "2026-07-02T10:00:00Z"
  }
}
```

---

## 4. Create Notification

### Endpoint

```http
POST /api/notifications
```

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body

```json
{
  "title": "Hackathon",
  "message": "24-hour Hackathon starts tomorrow.",
  "notificationType": "Event",
  "priority": "High"
}
```

### Response

```json
{
  "success": true,
  "message": "Notification created successfully.",
  "notificationId": 3
}
```

---

## 5. Update Notification

### Endpoint

```http
PUT /api/notifications/{id}
```

### Request Body

```json
{
  "title": "Hackathon Updated",
  "message": "Hackathon starts at 9:00 AM.",
  "priority": "Medium"
}
```

### Response

```json
{
  "success": true,
  "message": "Notification updated successfully."
}
```

---

## 6. Delete Notification

### Endpoint

```http
DELETE /api/notifications/{id}
```

### Response

```json
{
  "success": true,
  "message": "Notification deleted successfully."
}
```

---

## 7. Mark Notification as Read

### Endpoint

```http
PATCH /api/notifications/{id}/read
```

### Response

```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

## 8. Mark All Notifications as Read

### Endpoint

```http
PATCH /api/notifications/read-all
```

### Response

```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

---

## 9. Get Unread Notifications

### Endpoint

```http
GET /api/notifications/unread
```

### Response

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 3,
      "title": "Semester Results Published",
      "notificationType": "Result",
      "priority": "High"
    }
  ]
}
```

---

# Standard Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully."
}
```

---

# Standard Error Response

```json
{
  "success": false,
  "message": "Notification not found."
}
```


# HTTP Status Codes

- **200 OK** – Request completed successfully.
- **201 Created** – Resource created successfully.
- **400 Bad Request** – Invalid request data.
- **401 Unauthorized** – Authentication is required.
- **404 Not Found** – Notification not found.
- **500 Internal Server Error** – An unexpected server error occurred.


# Core Features

- User authentication using JWT
- Create notifications
- Retrieve all notifications
- Retrieve a notification by ID
- Update notifications
- Delete notifications
- Mark notifications as read
- Mark all notifications as read
- View unread notifications
- Real-time notification delivery

# Real-Time Notification Mechanism

The application uses WebSocket to deliver notifications in real time.

### Workflow

1. User logs into the application.
2. The frontend establishes a WebSocket connection with the backend.
3. The backend maintains active WebSocket connections.
4. When a new notification is created, the backend broadcasts it to all connected users.
5. If a user is offline, the notification is stored in the database and delivered after the user logs in again.


# Assumptions

- Users must log in before accessing protected API endpoints.
- Every request includes a valid JWT access token.
- Each notification has a unique ID.
- Notifications are stored in a database.
- The backend server runs on `http://localhost:5000`.
- WebSocket is used for real-time communication.
- Only authorized administrators can create or update notifications.