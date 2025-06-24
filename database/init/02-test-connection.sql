-- Test database connection and table creation
-- This script can be run manually to verify the database setup

\c gearment;

-- Test if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'leave_requests', 'leave_balances');

-- Test if enums exist
SELECT typname 
FROM pg_type 
WHERE typname IN ('user_role_enum', 'leave_type_enum', 'leave_status_enum');

-- Test inserting a sample user
INSERT INTO users (email, password, "firstName", "lastName", role) 
VALUES ('test@example.com', 'hashedpassword', 'Test', 'User', 'employee')
ON CONFLICT (email) DO NOTHING;

-- Test querying the user
SELECT id, email, "firstName", "lastName", role FROM users WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM users WHERE email = 'test@example.com';

-- Show table structure
\d users;
\d leave_requests;
\d leave_balances; 