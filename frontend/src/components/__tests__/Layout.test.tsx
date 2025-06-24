import { render, screen, fireEvent } from '@testing-library/react'
import Layout from '../Layout'
import { useAuthStore } from '../../store/authStore'

// Mock the auth store
jest.mock('../../store/authStore')

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

describe('Layout Component', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'employee' as const,
  }

  const mockManager = {
    ...mockUser,
    role: 'manager' as const,
  }

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  it('renders loading spinner when user is not available', () => {
    mockUseAuthStore.mockReturnValue({
      user: null,
      logout: jest.fn(),
    })

    render(<Layout>Test content</Layout>)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders layout with employee user', () => {
    const mockLogout = jest.fn()
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    })

    render(<Layout>Test content</Layout>)
    
    expect(screen.getByText('📋 Leave Management System')).toBeInTheDocument()
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
    expect(screen.getByText('💼 Employee')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('My Requests')).toBeInTheDocument()
    
    // Manager link should not be visible for employees
    expect(screen.queryByText('Approvals')).not.toBeInTheDocument()
  })

  it('renders layout with manager user', () => {
    const mockLogout = jest.fn()
    mockUseAuthStore.mockReturnValue({
      user: mockManager,
      logout: mockLogout,
    })

    render(<Layout>Test content</Layout>)
    
    expect(screen.getByText('📋 Leave Management System')).toBeInTheDocument()
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument()
    expect(screen.getByText('👨‍💼 Manager')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('My Requests')).toBeInTheDocument()
    expect(screen.getByText('Approvals')).toBeInTheDocument()
  })

  it('calls logout when logout button is clicked', () => {
    const mockLogout = jest.fn()
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    })

    render(<Layout>Test content</Layout>)
    
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)
    
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('renders children content', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    })

    render(
      <Layout>
        <div data-testid="test-content">Test content</div>
      </Layout>
    )
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
}) 