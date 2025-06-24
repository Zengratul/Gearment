import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LeaveRequestsPage from '../page'
import { useAuthStore } from '../../../store/authStore'
import { leaveRequestAPI } from '../../../services/api'

// Mock the auth store
jest.mock('../../../store/authStore')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock API
jest.mock('../../../services/api', () => ({
  leaveRequestAPI: {
    getAll: jest.fn(),
    getMyLeaveRequests: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockLeaveRequestAPI = leaveRequestAPI as jest.Mocked<typeof leaveRequestAPI>

describe('LeaveRequestsPage Component', () => {
  const mockPush = jest.fn()

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

  const mockLeaveRequests = [
    {
      id: '1',
      userId: '1',
      leaveType: 'annual',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      reason: 'Vacation',
      status: 'pending',
      createdAt: '2024-01-10T10:00:00Z',
    },
    {
      id: '2',
      userId: '1',
      leaveType: 'sick',
      startDate: '2024-01-20',
      endDate: '2024-01-21',
      reason: 'Not feeling well',
      status: 'approved',
      createdAt: '2024-01-18T10:00:00Z',
    },
    {
      id: '3',
      userId: '2',
      leaveType: 'personal',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      reason: 'Personal appointment',
      status: 'rejected',
      rejectionReason: 'Insufficient notice',
      createdAt: '2024-01-22T10:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any)
    
    // Mock window.confirm and window.prompt
    global.window.confirm = jest.fn(() => true)
    global.window.prompt = jest.fn(() => 'Test reason')
  })

  it('renders loading state initially', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    render(<LeaveRequestsPage />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders employee leave requests page', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('My Leave Requests')
    
    expect(screen.getByText('My Leave Requests')).toBeInTheDocument()
    expect(screen.getByText('View and manage your leave requests')).toBeInTheDocument()
    expect(screen.getByText('Vacation')).toBeInTheDocument()
    expect(screen.getByText('Not feeling well')).toBeInTheDocument()
  })

  it('renders manager leave requests page', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockManager,
    } as any)

    mockLeaveRequestAPI.getAll.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('All Leave Requests')
    
    expect(screen.getByText('All Leave Requests')).toBeInTheDocument()
    expect(screen.getByText('Manage all employee leave requests')).toBeInTheDocument()
  })

  it('filters requests by search term', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('My Leave Requests')
    
    const searchInput = screen.getByPlaceholderText('Search by type or reason...')
    fireEvent.change(searchInput, { target: { value: 'vacation' } })
    
    expect(screen.getByText('Vacation')).toBeInTheDocument()
    expect(screen.queryByText('Not feeling well')).not.toBeInTheDocument()
  })

  it('filters requests by status', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('My Leave Requests')
    
    const statusFilter = screen.getByDisplayValue('All Status')
    fireEvent.change(statusFilter, { target: { value: 'approved' } })
    
    expect(screen.getByText('Not feeling well')).toBeInTheDocument()
    expect(screen.queryByText('Vacation')).not.toBeInTheDocument()
  })

  it('filters requests by leave type', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('My Leave Requests')
    
    const typeFilter = screen.getByDisplayValue('All Types')
    fireEvent.change(typeFilter, { target: { value: 'annual' } })
    
    expect(screen.getByText('Vacation')).toBeInTheDocument()
    expect(screen.queryByText('Not feeling well')).not.toBeInTheDocument()
  })

  it('navigates to new leave request page', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('My Leave Requests')
    
    const newRequestButton = screen.getByText('📝 New Request')
    fireEvent.click(newRequestButton)
    
    expect(mockPush).toHaveBeenCalledWith('/leave-requests/new')
  })

  it('displays correct status badges', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('My Leave Requests')
    
    expect(screen.getByText('PENDING')).toBeInTheDocument()
    expect(screen.getByText('APPROVED')).toBeInTheDocument()
    expect(screen.getByText('REJECTED')).toBeInTheDocument()
  })

  it('displays correct leave type icons', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<LeaveRequestsPage />)
    
    await screen.findByText('My Leave Requests')
    
    expect(screen.getByText('🏖️')).toBeInTheDocument() // annual
    expect(screen.getByText('🏥')).toBeInTheDocument() // sick
    expect(screen.getByText('👤')).toBeInTheDocument() // personal
  })

  it('handles API errors gracefully', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
    } as any)

    mockLeaveRequestAPI.getMyLeaveRequests.mockRejectedValue(new Error('API Error'))

    render(<LeaveRequestsPage />)
    
    // Should still render the page structure even with errors
    await screen.findByText('My Leave Requests')
    
    expect(screen.getByText('My Leave Requests')).toBeInTheDocument()
  })
}) 