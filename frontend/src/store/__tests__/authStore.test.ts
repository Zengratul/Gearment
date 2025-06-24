import { act } from 'react-dom/test-utils'
import { useAuthStore } from '../authStore'

describe('authStore', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false })
  })

  it('should login user and set state', () => {
    act(() => {
      useAuthStore.getState().login({
        id: '1',
        email: 'a@b.com',
        firstName: 'A',
        lastName: 'B',
        role: 'employee',
      }, 'token123')
    })
    const state = useAuthStore.getState()
    expect(state.user).toMatchObject({ id: '1', email: 'a@b.com' })
    expect(state.accessToken).toBe('token123')
    expect(state.isAuthenticated).toBe(true)
  })

  it('should logout user and clear state', () => {
    act(() => {
      useAuthStore.getState().login({
        id: '1',
        email: 'a@b.com',
        firstName: 'A',
        lastName: 'B',
        role: 'employee',
      }, 'token123')
    })
    act(() => {
      useAuthStore.getState().logout()
    })
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should checkAuth correctly', () => {
    act(() => {
      useAuthStore.getState().login({
        id: '1',
        email: 'a@b.com',
        firstName: 'A',
        lastName: 'B',
        role: 'employee',
      }, 'token123')
    })
    expect(useAuthStore.getState().checkAuth()).toBe(true)
    act(() => {
      useAuthStore.getState().logout()
    })
    expect(useAuthStore.getState().checkAuth()).toBe(false)
  })
}) 