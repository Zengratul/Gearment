# Gearment Backend

A NestJS-based backend API for the Gearment application.

## Features

- RESTful API with NestJS
- PostgreSQL database with TypeORM
- User management system
- Environment-based configuration
- CORS enabled
- Global validation pipes

## Installation

```bash
npm install
```

## Environment Setup

Copy the example environment file and configure your database:

```bash
cp env.example .env
```

Update the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=gearment
PORT=5001
NODE_ENV=development
```

## Running the application

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

- `GET /api/` - Welcome message
- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
src/
├── controllers/     # API controllers
├── services/        # Business logic
├── entities/        # Database entities
├── dto/            # Data transfer objects
├── config/         # Configuration files
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Database

The application uses PostgreSQL with TypeORM. Make sure you have PostgreSQL running and the database `gearment` created before starting the application.

## Development

```bash
# Build the project
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
``` 