import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'
import { useAuthStore } from '../../../store/authStore'
import { authAPI } from '../../../services/api'

// Mock the auth store
jest.mock('../../../store/authStore')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock API
jest.mock('../../../services/api', () => ({
  authAPI: {
    login: jest.fn(),
  },
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockAuthAPI = authAPI as jest.Mocked<typeof authAPI>

describe('LoginPage Component', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>)
    
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      value: '',
      writable: true,
    })
  })

  it('renders login form with employee role by default', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
    } as unknown as ReturnType<typeof useAuthStore>)

    render(<LoginPage />)
    
    expect(screen.getByText('Leave Management System')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByText('Select your role and enter credentials')).toBeInTheDocument()
    expect(screen.getByText('👨‍💼 Employee')).toBeInTheDocument()
    expect(screen.getByText('👔 Manager')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@gmail.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12345678')).toBeInTheDocument()
  })

  it('switches to manager role and updates credentials', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
    } as unknown as ReturnType<typeof useAuthStore>)

    render(<LoginPage />)
    
    const managerButton = screen.getByText('👔 Manager')
    fireEvent.click(managerButton)
    
    expect(screen.getByDisplayValue('viet@gmail.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('12345678')).toBeInTheDocument()
  })

  it('handles form input changes', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
    } as unknown as ReturnType<typeof useAuthStore>)

    render(<LoginPage />)
    
    const emailInput = screen.getByDisplayValue('test@gmail.com')
    const passwordInput = screen.getByDisplayValue('12345678')
    
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } })
    
    expect(emailInput).toHaveValue('new@example.com')
    expect(passwordInput).toHaveValue('newpassword')
  })

  it('submits form successfully', async () => {
    const mockLogin = jest.fn()
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
    } as unknown as ReturnType<typeof useAuthStore>)

    const mockResponse = {
      data: {
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@gmail.com',
          role: 'employee',
        },
        accessToken: 'mock-token',
      },
    }

    mockAuthAPI.login.mockResolvedValue(mockResponse as unknown as any)

    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: 'Login' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockAuthAPI.login).toHaveBeenCalledWith({
        email: 'test@gmail.com',
        password: '12345678',
      })
    })
    
    expect(mockLogin).toHaveBeenCalledWith(mockResponse.data.user, mockResponse.data.accessToken)
  })

  it('shows error message on login failure', async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
    } as unknown as ReturnType<typeof useAuthStore>)

    const errorMessage = 'Invalid credentials'
    mockAuthAPI.login.mockRejectedValue({
      response: { data: { message: errorMessage } },
    })

    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: 'Login' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('redirects to dashboard if already authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      login: jest.fn(),
    } as unknown as ReturnType<typeof useAuthStore>)

    render(<LoginPage />)
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('shows loading state during form submission', async () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
    } as unknown as ReturnType<typeof useAuthStore>)

    // Create a promise that doesn't resolve immediately
    let resolvePromise: (value: { data: { user: Record<string, unknown>; accessToken: string } }) => void
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockAuthAPI.login.mockReturnValue(pendingPromise as unknown as any)

    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: 'Login' })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Logging in...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Resolve the promise
    resolvePromise!({ data: { user: {}, accessToken: 'token' } })
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })
  })

  it('displays demo credentials information', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
    } as unknown as ReturnType<typeof useAuthStore>)

    render(<LoginPage />)
    
    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument()
    expect(screen.getByText(/Employee: test@gmail.com \/ 12345678/)).toBeInTheDocument()
    expect(screen.getByText(/Manager: viet@gmail.com \/ 12345678/)).toBeInTheDocument()
  })
}) 