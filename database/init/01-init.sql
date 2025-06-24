-- Initialize Gearment Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if not exists (handled by POSTGRES_DB environment variable)
-- The database 'gearment' will be created automatically

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE gearment TO postgres;

-- Connect to the gearment database
\c gearment;

-- Create enum types (with error handling)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('employee', 'manager');
        RAISE NOTICE 'Created user_role_enum type';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_type_enum') THEN
        CREATE TYPE leave_type_enum AS ENUM ('annual', 'sick', 'personal', 'maternity', 'paternity');
        RAISE NOTICE 'Created leave_type_enum type';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_status_enum') THEN
        CREATE TYPE leave_status_enum AS ENUM ('pending', 'approved', 'rejected');
        RAISE NOTICE 'Created leave_status_enum type';
    END IF;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "phoneNumber" VARCHAR,
    role user_role_enum DEFAULT 'employee',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "leaveType" leave_type_enum NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "numberOfDays" INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status leave_status_enum DEFAULT 'pending',
    "approvedBy" UUID REFERENCES users(id),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leave_balances table
CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "leaveType" leave_type_enum NOT NULL,
    "totalDays" INTEGER DEFAULT 0,
    "usedDays" INTEGER DEFAULT 0,
    "remainingDays" INTEGER DEFAULT 0,
    year INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "leaveType", year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests("userId");
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_balances_user_id ON leave_balances("userId");
CREATE INDEX IF NOT EXISTS idx_leave_balances_year ON leave_balances(year);

-- Grant permissions on tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Verify tables were created
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully';
    RAISE NOTICE 'Tables created: users, leave_requests, leave_balances';
    RAISE NOTICE 'Enum types created: user_role_enum, leave_type_enum, leave_status_enum';
END $$; 