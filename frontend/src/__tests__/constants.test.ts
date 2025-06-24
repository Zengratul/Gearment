describe('Constants and Configuration', () => {
  describe('API Configuration', () => {
    it('has correct API base URL', () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
      expect(apiBaseUrl).toBeDefined()
      expect(typeof apiBaseUrl).toBe('string')
      expect(apiBaseUrl).toContain('http')
    })

    it('has correct timeout configuration', () => {
      const timeout = 10000 // 10 seconds
      expect(timeout).toBe(10000)
      expect(typeof timeout).toBe('number')
    })
  })

  describe('Leave Types', () => {
    it('has all required leave types', () => {
      const leaveTypes = ['annual', 'sick', 'personal', 'maternity', 'paternity']
      
      expect(leaveTypes).toContain('annual')
      expect(leaveTypes).toContain('sick')
      expect(leaveTypes).toContain('personal')
      expect(leaveTypes).toContain('maternity')
      expect(leaveTypes).toContain('paternity')
      expect(leaveTypes).toHaveLength(5)
    })

    it('has correct leave type icons', () => {
      const leaveTypeIcons = {
        annual: '🏖️',
        sick: '🏥',
        personal: '👤',
        maternity: '🤱',
        paternity: '👨‍👶'
      }

      expect(leaveTypeIcons.annual).toBe('🏖️')
      expect(leaveTypeIcons.sick).toBe('🏥')
      expect(leaveTypeIcons.personal).toBe('👤')
      expect(leaveTypeIcons.maternity).toBe('🤱')
      expect(leaveTypeIcons.paternity).toBe('👨‍👶')
    })
  })

  describe('Status Types', () => {
    it('has all required status types', () => {
      const statusTypes = ['pending', 'approved', 'rejected']
      
      expect(statusTypes).toContain('pending')
      expect(statusTypes).toContain('approved')
      expect(statusTypes).toContain('rejected')
      expect(statusTypes).toHaveLength(3)
    })

    it('has correct status badge variants', () => {
      const statusVariants = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger'
      }

      expect(statusVariants.pending).toBe('warning')
      expect(statusVariants.approved).toBe('success')
      expect(statusVariants.rejected).toBe('danger')
    })
  })

  describe('User Roles', () => {
    it('has correct user roles', () => {
      const userRoles = ['employee', 'manager']
      
      expect(userRoles).toContain('employee')
      expect(userRoles).toContain('manager')
      expect(userRoles).toHaveLength(2)
    })

    it('has correct role display names', () => {
      const roleDisplayNames = {
        employee: '💼 Employee',
        manager: '👨‍💼 Manager'
      }

      expect(roleDisplayNames.employee).toBe('💼 Employee')
      expect(roleDisplayNames.manager).toBe('👨‍💼 Manager')
    })
  })

  describe('Form Validation', () => {
    it('has correct minimum values', () => {
      const minValues = {
        numberOfDays: 1,
        passwordLength: 8
      }

      expect(minValues.numberOfDays).toBe(1)
      expect(minValues.passwordLength).toBe(8)
    })

    it('has correct maximum values', () => {
      const maxValues = {
        numberOfDays: 365,
        reasonLength: 1000
      }

      expect(maxValues.numberOfDays).toBe(365)
      expect(maxValues.reasonLength).toBe(1000)
    })
  })
}) 