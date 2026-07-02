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

---

# Stage 2 – Database Design

## Database Selection

I recommend using **MySQL** as the persistent database for the Campus Notification System.

### Why MySQL?

- It is open-source and widely used for web applications.
- Supports ACID transactions to maintain data consistency.
- Handles relational data efficiently.
- Provides indexing for faster query performance.
- Easy to integrate with Node.js and Express applications.
- Suitable for storing large amounts of notification data.
---

# Database Schema

## Users Table

The **Users** table stores information about students and administrators.

- **id** – INT, Primary Key, Auto Increment
- **name** – VARCHAR(100), Stores the user's name
- **email** – VARCHAR(100), Stores a unique email address
- **password** – VARCHAR(255), Stores the encrypted password
- **role** – VARCHAR(20), Indicates whether the user is a Student or Admin
- **created_at** – TIMESTAMP, Stores the account creation date and time

---

## Notifications Table

The **Notifications** table stores all notification details.

- **id** – INT, Primary Key, Auto Increment
- **title** – VARCHAR(255), Notification title
- **message** – TEXT, Notification description
- **notification_type** – VARCHAR(50), Type of notification (Placement, Event, Result, etc.)
- **priority** – VARCHAR(20), Priority level (Low, Medium, High)
- **created_by** – INT, References the administrator who created the notification
- **created_at** – TIMESTAMP, Stores when the notification was created

---

## User_Notifications Table

The **User_Notifications** table keeps track of which notifications are sent to users and whether they have been read.

- **id** – INT, Primary Key, Auto Increment
- **user_id** – INT, Foreign Key referencing the Users table
- **notification_id** – INT, Foreign Key referencing the Notifications table
- **is_read** – BOOLEAN, Indicates whether the notification has been read
- **read_at** – TIMESTAMP, Stores the date and time when the notification was read

---

# Entity Relationship

- One administrator can create many notifications.
- One notification can be sent to many users.
- One user can receive many notifications.

This creates a many-to-many relationship between users and notifications using the **User_Notifications** table.

---

# Challenges as Data Increases

As the number of users and notifications grows, the following problems may occur:

- Slower database queries.
- Increased storage requirements.
- Higher server load.
- Delay in delivering notifications.
- Longer response times.

---

# Possible Solutions

To improve performance:

- Create indexes on frequently searched columns such as `user_id`, `notification_id`, and `created_at`.
- Use pagination when retrieving notifications.
- Archive old notifications that are no longer needed.
- Cache frequently accessed data using Redis.
- Use database replication for read-heavy workloads.
- Partition large notification tables by date.

---

# Sample SQL Queries

## Create a Notification

```sql
INSERT INTO notifications
(title, message, notification_type, priority, created_by)
VALUES
('Placement Drive',
'Infosys Campus Drive on Friday',
'Placement',
'High',
1);
```

---

## Get All Notifications

```sql
SELECT *
FROM notifications
ORDER BY created_at DESC;
```

---

## Get Notification by ID

```sql
SELECT *
FROM notifications
WHERE id = 1;
```

---

## Get Notifications for a User

```sql
SELECT n.*
FROM notifications n
JOIN user_notifications un
ON n.id = un.notification_id
WHERE un.user_id = 101
ORDER BY n.created_at DESC;
```

---

## Mark Notification as Read

```sql
UPDATE user_notifications
SET is_read = TRUE,
    read_at = CURRENT_TIMESTAMP
WHERE user_id = 101
AND notification_id = 5;
```

---

## Mark All Notifications as Read

```sql
UPDATE user_notifications
SET is_read = TRUE,
    read_at = CURRENT_TIMESTAMP
WHERE user_id = 101;
```

---

## Delete a Notification

```sql
DELETE FROM notifications
WHERE id = 5;
```

---

## Get Unread Notifications

```sql
SELECT n.*
FROM notifications n
JOIN user_notifications un
ON n.id = un.notification_id
WHERE un.user_id = 101
AND un.is_read = FALSE;
```

---

# NoSQL Alternative

If the application needs to support millions of notifications with flexible document structures, **MongoDB** can also be used.

Example document:

```json
{
  "_id": "101",
  "title": "Placement Drive",
  "message": "Infosys Campus Drive on Friday",
  "notificationType": "Placement",
  "priority": "High",
  "createdAt": "2026-07-02T10:00:00Z"
}
```

However, for this system, **MySQL** is preferred because the data is structured and has clear relationships between users and notifications.