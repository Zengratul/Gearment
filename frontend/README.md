# Leave Management System - Frontend

A modern, responsive web application for managing employee leave requests built with Next.js, React Bootstrap, and TypeScript.

## Features

### 🔐 Authentication
- Role-based login (Employee/Manager)
- JWT token authentication
- Protected routes
- Automatic session management

### 📊 Dashboard
- **Leave Balance Display**: Visual cards showing different leave types with progress bars
- **Recent Requests**: Table of recent leave requests with status indicators
- **Quick Actions**: Easy access to common tasks
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 📝 Leave Requests
- **Request Management**: View, create, edit, and delete leave requests
- **Advanced Filtering**: Filter by status, leave type, and search terms
- **Form Validation**: Comprehensive form validation with user feedback
- **Date Calculation**: Automatic calculation of leave duration

### 👔 Manager Features
- **Approval System**: Approve or reject leave requests with comments
- **Request Overview**: Statistics and detailed view of pending requests
- **Employee Information**: View employee details for each request
- **Bulk Actions**: Efficient management of multiple requests

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React Bootstrap 5
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios with interceptors
- **TypeScript**: Full type safety
- **Authentication**: JWT tokens with localStorage

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── leave-requests/    # Leave requests pages
│   ├── login/            # Login page
│   └── manager/          # Manager-specific pages
├── components/           # Reusable React components
├── services/            # API services and utilities
├── store/               # Zustand state management
└── middleware.ts        # Next.js middleware for auth
```

## Key Components

### Layout Component
- Navigation bar with user info and logout
- Role-based menu items
- Responsive design

### Authentication Store
- User state management
- Token persistence
- Login/logout functionality

### API Service
- Centralized API calls
- Request/response interceptors
- Error handling
- TypeScript interfaces

## Demo Credentials

### Employee Account
- Email: `employee@example.com`
- Password: `12345678`

### Manager Account
- Email: `manager@example.com`
- Password: `12345678`

## Features in Detail

### Leave Types Supported
- 🏖️ Annual Leave
- 🏥 Sick Leave
- 👤 Personal Leave
- 🤱 Maternity Leave
- 👨‍👶 Paternity Leave

### Status Management
- ⏳ Pending
- ✅ Approved
- ❌ Rejected

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Touch-friendly interfaces
- Optimized for all screen sizes

## API Integration

The frontend communicates with the backend API through the following endpoints:

- `POST /auth/login` - User authentication
- `GET /leave-requests` - Fetch all leave requests
- `POST /leave-requests` - Create new leave request
- `PATCH /leave-requests/:id` - Update leave request (approve/reject)
- `DELETE /leave-requests/:id` - Delete leave request
- `GET /leave-balances/user/:userId` - Get user's leave balance

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent component structure
- Proper error handling

## Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Docker
```bash
# Build the image
docker build -t leave-management-frontend .

# Run the container
docker run -p 3001:3000 leave-management-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
