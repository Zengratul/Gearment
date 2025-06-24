# Gearment Docker Setup

This project uses Docker Compose to run the NestJS backend and PostgreSQL database.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   # View all logs
   docker-compose logs -f
   
   # View specific service logs
   docker-compose logs -f backend
   docker-compose logs -f postgres
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Services

### PostgreSQL Database
- **Container:** `gearment-postgres`
- **Port:** `5432`
- **Database:** `gearment`
- **Username:** `postgres`
- **Password:** `12345678`
- **Data persistence:** `postgres_data` volume

### NestJS Backend
- **Container:** `gearment-backend`
- **Port:** `5001`
- **API Endpoint:** `http://localhost:5000/api`
- **Development mode:** Hot reload enabled

## Environment Variables

The backend service uses the following environment variables:
- `NODE_ENV=development`
- `PORT=5000`
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=12345678`
- `DB_NAME=gearment`
- `JWT_SECRET=vietdeptrai`
- `JWT_EXPIRES_IN=24h`

## Useful Commands

### Development
```bash
# Start in development mode
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# View real-time logs
docker-compose logs -f backend
```

### Database Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d gearment

# Backup database
docker-compose exec postgres pg_dump -U postgres gearment > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d gearment < backup.sql
```

### Container Management
```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v

# Remove all containers and rebuild
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Port Conflicts
If you get port conflicts, you can modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Change 5432 to 5433 for PostgreSQL
  - "5001:5000"  # Change 5000 to 5001 for Backend
```

### Database Connection Issues
1. Check if PostgreSQL is healthy:
   ```bash
   docker-compose ps
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

3. Wait for database to be ready before starting backend:
   The docker-compose.yml includes a healthcheck and dependency configuration.

### Backend Issues
1. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

2. Rebuild the backend:
   ```bash
   docker-compose up -d --build backend
   ```

## File Structure
```
Gearment/
├── docker-compose.yml          # Main Docker Compose configuration
├── backend/
│   ├── Dockerfile             # Backend container configuration
│   ├── .dockerignore          # Files to exclude from Docker build
│   └── ...                    # NestJS application files
├── database/
│   └── init/
│       └── 01-init.sql        # Database initialization script
└── DOCKER_README.md           # This file
``` 