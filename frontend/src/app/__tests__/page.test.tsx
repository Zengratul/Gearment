import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Home from '../page'
import { useAuthStore } from '../../store/authStore'

// Mock the auth store
jest.mock('../../store/authStore')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('Home Page', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any)
  })

  it('renders loading spinner', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
    } as any)

    render(<Home />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to dashboard when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
    } as any)

    render(<Home />)
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })

  it('redirects to login when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
    } as any)

    render(<Home />)
    
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('has correct styling classes', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
    } as any)

    render(<Home />)
    
    const container = screen.getByRole('status').parentElement
    expect(container).toHaveClass('d-flex', 'justify-content-center', 'align-items-center', 'min-vh-100')
  })
}) 