# Testing Guide

Frontend đã được setup với Jest và React Testing Library để viết unit tests.

## Cài đặt

Tất cả dependencies đã được cài đặt:
- `jest`: Testing framework
- `@testing-library/react`: Testing utilities cho React
- `@testing-library/jest-dom`: Custom matchers cho DOM testing
- `@testing-library/user-event`: Simulate user interactions

## Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests ở chế độ watch (tự động chạy lại khi có thay đổi)
npm run test:watch

# Chạy tests với coverage report
npm run test:coverage
```

## Cấu trúc Test Files

- Test files nên có tên `*.test.tsx` hoặc `*.spec.tsx`
- Đặt test files trong thư mục `__tests__` hoặc cùng thư mục với component
- Ví dụ: `src/components/Layout.tsx` → `src/components/__tests__/Layout.test.tsx`

## Ví dụ Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interaction', () => {
    render(<MyComponent />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

## Testing Utilities

### Render
```tsx
import { render } from '@testing-library/react'
render(<MyComponent />)
```

### Queries
```tsx
import { screen } from '@testing-library/react'

// Tìm element theo text
screen.getByText('Hello')
screen.queryByText('Hello') // Không throw error nếu không tìm thấy

// Tìm element theo role
screen.getByRole('button')
screen.getByRole('textbox')

// Tìm element theo test id
screen.getByTestId('my-button')
```

### User Events
```tsx
import { fireEvent } from '@testing-library/react'

fireEvent.click(button)
fireEvent.change(input, { target: { value: 'new value' } })
fireEvent.submit(form)
```

### Assertions
```tsx
import '@testing-library/jest-dom'

expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('Hello')
expect(element).toHaveClass('active')
expect(element).toBeVisible()
expect(element).toBeDisabled()
```

## Mocking

### Mock Components
```tsx
jest.mock('../MyComponent', () => ({
  __esModule: true,
  default: () => <div>Mocked Component</div>
}))
```

### Mock Hooks
```tsx
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'John' },
    login: jest.fn(),
    logout: jest.fn()
  })
}))
```

### Mock API Calls
```tsx
jest.mock('../services/api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'test' })
}))
```

## Best Practices

1. **Test behavior, not implementation**: Test những gì user thấy và làm, không test implementation details
2. **Use semantic queries**: Ưu tiên `getByRole`, `getByLabelText` thay vì `getByTestId`
3. **Keep tests simple**: Mỗi test chỉ test một thing
4. **Use descriptive test names**: Tên test nên mô tả rõ behavior
5. **Setup and teardown**: Sử dụng `beforeEach` và `afterEach` để setup/cleanup

## Coverage

Chạy `npm run test:coverage` để xem coverage report. Mục tiêu coverage thường là:
- Statements: > 80%
- Branches: > 80%
- Functions: > 80%
- Lines: > 80% 