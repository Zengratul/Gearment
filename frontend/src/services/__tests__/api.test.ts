import axios from 'axios'

jest.mock('axios')

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}

// @ts-expect-error: Mocking axios.create to return custom instance for testing
axios.create.mockReturnValue(mockAxiosInstance)

let authAPI, leaveRequestAPI, leaveBalanceAPI, usersAPI

beforeAll(async () => {
  const apiModule = await import('../api')
  authAPI = apiModule.authAPI
  leaveRequestAPI = apiModule.leaveRequestAPI
  leaveBalanceAPI = apiModule.leaveBalanceAPI
  usersAPI = apiModule.usersAPI
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('api service', () => {
  it('should call authAPI.login', async () => {
    mockAxiosInstance.post.mockResolvedValue({ data: { accessToken: 'token', user: { id: '1' } } })
    const result = await authAPI.login({ email: 'a@b.com', password: '123' })
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: '123' })
    expect(result.data.accessToken).toBe('token')
  })

  it('should call leaveRequestAPI.getAll', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: [] })
    const result = await leaveRequestAPI.getAll()
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/leave-request/all')
    expect(result.data).toEqual([])
  })

  it('should call leaveBalanceAPI.getByUserId', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: [] })
    const result = await leaveBalanceAPI.getByUserId()
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/leave-balance')
    expect(result.data).toEqual([])
  })

  it('should call usersAPI.getProfile', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: { id: '1' } })
    const result = await usersAPI.getProfile()
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile')
    expect(result.data.id).toBe('1')
  })
}) 