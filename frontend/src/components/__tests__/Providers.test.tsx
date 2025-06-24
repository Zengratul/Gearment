import { render, screen } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'
import Providers from '../Providers'

// Mock React Query components
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="query-client-provider">{children}</div>,
}))

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="react-query-devtools">DevTools</div>,
}))

const mockQueryClient = QueryClient as jest.MockedClass<typeof QueryClient>

describe('Providers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockQueryClient.mockImplementation(() => ({
      defaultOptions: {
        queries: {
          staleTime: 60000,
          retry: 1,
        },
      },
    } as any))
  })

  it('renders children when mounted', () => {
    render(
      <Providers>
        <div data-testid="test-child">Test Child</div>
      </Providers>
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('creates QueryClient with correct default options', () => {
    render(
      <Providers>
        <div>Test</div>
      </Providers>
    )
    
    expect(mockQueryClient).toHaveBeenCalledWith({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
        },
      },
    })
  })

  it('renders QueryClientProvider wrapper', () => {
    render(
      <Providers>
        <div>Test</div>
      </Providers>
    )
    
    expect(screen.getByTestId('query-client-provider')).toBeInTheDocument()
  })

  it('renders ReactQueryDevtools', () => {
    render(
      <Providers>
        <div>Test</div>
      </Providers>
    )
    
    expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument()
  })

  it('renders multiple children correctly', () => {
    render(
      <Providers>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </Providers>
    )
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Child 3')).toBeInTheDocument()
  })
}) 