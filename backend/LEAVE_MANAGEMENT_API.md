# Leave Management API

This document describes the leave management endpoints implemented in the Gearment backend API.

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Leave Request Endpoints

### POST /leave-request
Submit a new leave request.

**Request Body:**
```json
{
  "leaveType": "annual",
  "startDate": "2024-01-15",
  "endDate": "2024-01-19",
  "numberOfDays": 5,
  "reason": "Annual vacation"
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "leaveType": "annual",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-19T00:00:00.000Z",
  "numberOfDays": 5,
  "reason": "Annual vacation",
  "status": "pending",
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}
```

### GET /leave-request
View your own leave requests.

**Response:**
```json
[
  {
    "id": "uuid",
    "leaveType": "annual",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-19T00:00:00.000Z",
    "numberOfDays": 5,
    "reason": "Annual vacation",
    "status": "approved",
    "approvedBy": "manager-uuid",
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe"
    },
    "approver": {
      "id": "manager-uuid",
      "firstName": "Jane",
      "lastName": "Manager"
    }
  }
]
```

### GET /leave-request/all
View all leave requests (managers only).

**Response:** Same as GET /leave-request but includes all users' requests.

### GET /leave-request/:id
Get a specific leave request by ID.

**Response:** Same as individual leave request object.

### PATCH /leave-request/:id
Approve/reject leave request (managers only).

**Request Body:**
```json
{
  "status": "approved"
}
```

Or for rejection:
```json
{
  "status": "rejected",
  "rejectionReason": "Insufficient notice period"
}
```

**Response:** Updated leave request object.

## Leave Balance Endpoints

### GET /leave-balance
Show available leave days.

**Query Parameters:**
- `year` (optional): Year to get leave balance for (defaults to current year)

**Response:**
```json
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "leaveType": "annual",
    "totalDays": 20,
    "usedDays": 5,
    "remainingDays": 15,
    "year": 2024,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  },
  {
    "id": "uuid",
    "userId": "user-uuid",
    "leaveType": "sick",
    "totalDays": 10,
    "usedDays": 2,
    "remainingDays": 8,
    "year": 2024,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  }
]
```

## Leave Types

Available leave types:
- `annual`: Annual leave
- `sick`: Sick leave
- `personal`: Personal leave
- `maternity`: Maternity leave
- `paternity`: Paternity leave

## Leave Status

Available leave statuses:
- `pending`: Request is pending approval
- `approved`: Request has been approved
- `rejected`: Request has been rejected

## User Roles

- `employee`: Regular employee (can submit requests, view own requests and balances)
- `manager`: Manager (can approve/reject requests, view all requests)

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Insufficient leave balance",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Authorization header is required",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Only managers can approve/reject leave requests",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Leave request not found",
  "error": "Not Found"
}
```

## Business Rules

1. **Leave Balance Validation**: Users cannot submit leave requests that exceed their available leave balance.
2. **Date Validation**: Start date must be before end date and cannot be in the past.
3. **Manager Authorization**: Only users with manager role can approve/reject leave requests.
4. **Status Updates**: Only pending requests can be approved or rejected.
5. **Rejection Reason**: Rejection reason is required when rejecting a leave request.
6. **Automatic Balance Update**: When a leave request is approved, the user's leave balance is automatically updated. 