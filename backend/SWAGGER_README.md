# Swagger Documentation for Gearment Backend

## Overview

This NestJS backend includes comprehensive Swagger/OpenAPI documentation that provides interactive API documentation for all endpoints.

## Accessing Swagger Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:5001/api/docs
```

## Features

### 1. Interactive API Documentation
- **Real-time testing**: Test API endpoints directly from the browser
- **Request/Response examples**: See example data for all endpoints
- **Parameter validation**: Visual feedback for required/optional parameters
- **Response schemas**: Detailed response structure documentation

### 2. Authentication Support
- Bearer token authentication is configured
- JWT token support for protected endpoints

### 3. Organized Endpoints
- **Users**: User management operations (CRUD)
- **Leave Requests**: Leave request management
- **Authentication**: Login and authentication endpoints

## API Endpoints Documentation

### Users Endpoints (`/api/users`)

#### POST `/api/users`
- **Description**: Create a new user
- **Request Body**: `CreateUserDto`
- **Response**: User object with ID and timestamps
- **Status Codes**: 201 (Created), 400 (Bad Request), 409 (Conflict)

#### GET `/api/users`
- **Description**: Get all users
- **Response**: Array of user objects
- **Status Codes**: 200 (OK)

#### GET `/api/users/:id`
- **Description**: Get a specific user by ID
- **Parameters**: `id` (string)
- **Response**: User object
- **Status Codes**: 200 (OK), 404 (Not Found)

#### PUT `/api/users/:id`
- **Description**: Update a user by ID
- **Parameters**: `id` (string)
- **Request Body**: `CreateUserDto`
- **Response**: Updated user object
- **Status Codes**: 200 (OK), 400 (Bad Request), 404 (Not Found)

#### DELETE `/api/users/:id`
- **Description**: Delete a user by ID
- **Parameters**: `id` (string)
- **Response**: Success message
- **Status Codes**: 200 (OK), 404 (Not Found)

### Data Transfer Objects (DTOs)

#### CreateUserDto
```typescript
{
  email: string;           // User email address
  password: string;        // User password (min 6 chars)
  firstName: string;       // User first name
  lastName: string;        // User last name
  phoneNumber?: string;    // Optional phone number
}
```

#### LoginDto
```typescript
{
  email: string;           // User email address
  password: string;        // User password
}
```

#### CreateLeaveRequestDto
```typescript
{
  leaveType: LeaveType;    // Type of leave (ANNUAL, SICK, etc.)
  startDate: Date;         // Start date (ISO string)
  endDate: Date;           // End date (ISO string)
  numberOfDays: number;    // Number of days (1-30)
  reason: string;          // Reason for leave
}
```

#### UpdateLeaveRequestDto
```typescript
{
  status: LeaveStatus;     // Status (PENDING, APPROVED, REJECTED)
  rejectionReason?: string; // Optional rejection reason
}
```

## Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run start:dev
   ```

3. **Access Swagger documentation**:
   Open your browser and navigate to `http://localhost:5001/api/docs`

## Configuration

The Swagger configuration is set up in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Gearment API')
  .setDescription('The Gearment API description')
  .setVersion('1.0')
  .addTag('users', 'User management endpoints')
  .addTag('leave-requests', 'Leave request management endpoints')
  .addBearerAuth()
  .build();
```

## Adding New Endpoints

To add Swagger documentation to new endpoints:

1. **Add decorators to your controller**:
   ```typescript
   @ApiTags('your-tag')
   @ApiOperation({ summary: 'Your operation summary' })
   @ApiResponse({ status: 200, description: 'Success' })
   ```

2. **Add decorators to your DTOs**:
   ```typescript
   @ApiProperty({ description: 'Field description', example: 'example value' })
   ```

3. **Use validation decorators**:
   ```typescript
   @IsString()
   @IsEmail()
   @MinLength(6)
   ```

## Benefits

- **Developer Experience**: Easy to understand and test APIs
- **Client Integration**: Clear documentation for frontend developers
- **API Testing**: Built-in testing interface
- **Documentation**: Always up-to-date with code changes
- **Team Collaboration**: Shared understanding of API structure

## Troubleshooting

If Swagger documentation is not accessible:

1. Check if the application is running on the correct port
2. Verify that all Swagger dependencies are installed
3. Check the console for any error messages
4. Ensure the Swagger setup is properly configured in `main.ts` 