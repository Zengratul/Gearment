import { render, screen, fireEvent, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Dashboard from '../page'
import { useAuthStore } from '../../../store/authStore'
import { leaveBalanceAPI, leaveRequestAPI } from '../../../services/api'

// Mock the auth store
jest.mock('../../../store/authStore')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock API
jest.mock('../../../services/api', () => ({
  leaveBalanceAPI: {
    getByUserId: jest.fn(),
  },
  leaveRequestAPI: {
    getAll: jest.fn(),
    getMyLeaveRequests: jest.fn(),
  },
}))

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockLeaveBalanceAPI = leaveBalanceAPI as jest.Mocked<typeof leaveBalanceAPI>
const mockLeaveRequestAPI = leaveRequestAPI as jest.Mocked<typeof leaveRequestAPI>

describe('Dashboard Component', () => {
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

  const mockLeaveBalances = [
    {
      id: '1',
      userId: '1',
      leaveType: 'annual',
      year: 2024,
      totalDays: 20,
      usedDays: 5,
      remainingDays: 15,
    },
    {
      id: '2',
      userId: '1',
      leaveType: 'sick',
      year: 2024,
      totalDays: 10,
      usedDays: 2,
      remainingDays: 8,
    },
  ]

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
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any)
    
    // Mock setTimeout to execute immediately
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders loading state initially', () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    } as any)

    render(<Dashboard />)
    
    expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
  })

  it('renders dashboard with leave balances for employee', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    // Wait for data to load
    await screen.findByText('Welcome back, John!')
    
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Leave Balance')).toBeInTheDocument()
    expect(screen.getByText('annual Leave')).toBeInTheDocument()
    expect(screen.getByText('sick Leave')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument() // remaining days
    expect(screen.getByText('8')).toBeInTheDocument() // remaining days
  })

  it('renders dashboard with leave balances for manager', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockManager,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getAll.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    // Wait for data to load
    await screen.findByText('Welcome back, John!')
    
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Leave Balance')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Manage Approvals/i })).toBeInTheDocument()
  })

  it('shows quick actions buttons', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    await screen.findByText('Welcome back, John!')
    
    expect(screen.getByText('📝 Submit Leave Request')).toBeInTheDocument()
    expect(screen.getByText('📋 View All Requests')).toBeInTheDocument()
  })

  it('shows manager-specific quick actions for manager', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockManager,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getAll.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    await screen.findByText('Welcome back, John!')
    
    expect(screen.getByText('✅ Manage Approvals')).toBeInTheDocument()
  })

  it('navigates to new leave request page', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    await screen.findByText('Welcome back, John!')
    
    const submitButton = screen.getByText('📝 Submit Leave Request')
    fireEvent.click(submitButton)
    
    expect(mockPush).toHaveBeenCalledWith('/leave-requests/new')
  })

  it('navigates to leave requests page', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    await screen.findByText('Welcome back, John!')
    
    const viewAllButton = screen.getByText('📋 View All Requests')
    fireEvent.click(viewAllButton)
    
    expect(mockPush).toHaveBeenCalledWith('/leave-requests')
  })

  it('navigates to approvals page for manager', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockManager,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getAll.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    await screen.findByText('Welcome back, John!')
    
    const approvalsButton = screen.getByText('✅ Manage Approvals')
    fireEvent.click(approvalsButton)
    
    expect(mockPush).toHaveBeenCalledWith('/manager/approvals')
  })

  it('displays recent leave requests', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockResolvedValue({ data: mockLeaveBalances })
    mockLeaveRequestAPI.getMyLeaveRequests.mockResolvedValue({ data: mockLeaveRequests })

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    await screen.findByText('Welcome back, John!')
    
    expect(screen.getByText('Recent Leave Requests')).toBeInTheDocument()
    expect(screen.getByText('PENDING')).toBeInTheDocument()
    expect(screen.getByText('APPROVED')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    } as any)

    mockLeaveBalanceAPI.getByUserId.mockRejectedValue(new Error('API Error'))
    mockLeaveRequestAPI.getMyLeaveRequests.mockRejectedValue(new Error('API Error'))

    render(<Dashboard />)
    
    // Fast-forward timers to complete auth check
    act(() => {
      jest.advanceTimersByTime(1100)
    })
    
    // Should still render the dashboard structure even with errors
    await screen.findByText('Welcome back, John!')
    
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })
}) 