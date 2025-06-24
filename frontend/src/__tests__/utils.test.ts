describe('Utility Functions', () => {
  describe('Date formatting', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = date.toLocaleDateString()
      expect(formatted).toBeDefined()
      expect(typeof formatted).toBe('string')
    })

    it('handles invalid date', () => {
      const invalidDate = new Date('invalid')
      expect(invalidDate.toString()).toContain('Invalid')
    })
  })

  describe('String validation', () => {
    it('validates email format', () => {
      const validEmail = 'test@example.com'
      const invalidEmail = 'invalid-email'
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      expect(emailRegex.test(validEmail)).toBe(true)
      expect(emailRegex.test(invalidEmail)).toBe(false)
    })

    it('validates required fields', () => {
      const required = (value: string) => Boolean(value && value.trim().length > 0)
      
      expect(required('test')).toBe(true)
      expect(required('')).toBe(false)
      expect(required('   ')).toBe(false)
    })
  })

  describe('Number validation', () => {
    it('validates positive numbers', () => {
      const isPositive = (num: number) => num > 0
      
      expect(isPositive(5)).toBe(true)
      expect(isPositive(0)).toBe(false)
      expect(isPositive(-1)).toBe(false)
    })

    it('validates number range', () => {
      const inRange = (num: number, min: number, max: number) => num >= min && num <= max
      
      expect(inRange(5, 1, 10)).toBe(true)
      expect(inRange(0, 1, 10)).toBe(false)
      expect(inRange(15, 1, 10)).toBe(false)
    })
  })

  describe('Array operations', () => {
    it('filters arrays correctly', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const evenNumbers = numbers.filter(num => num % 2 === 0)
      
      expect(evenNumbers).toEqual([2, 4, 6, 8, 10])
    })

    it('maps arrays correctly', () => {
      const numbers = [1, 2, 3]
      const doubled = numbers.map(num => num * 2)
      
      expect(doubled).toEqual([2, 4, 6])
    })

    it('reduces arrays correctly', () => {
      const numbers = [1, 2, 3, 4, 5]
      const sum = numbers.reduce((acc, num) => acc + num, 0)
      
      expect(sum).toBe(15)
    })
  })
}) 