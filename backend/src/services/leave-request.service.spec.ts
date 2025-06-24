import { LeaveRequestService } from './leave-request.service';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

describe('LeaveRequestService', () => {
  let service: LeaveRequestService;
  let leaveRequestRepository: any;
  let userRepository: any;
  let leaveBalanceRepository: any;

  beforeEach(() => {
    leaveRequestRepository = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), delete: jest.fn() };
    userRepository = { findOne: jest.fn() };
    leaveBalanceRepository = { findOne: jest.fn(), save: jest.fn() };
    service = new LeaveRequestService(
      leaveRequestRepository as any,
      userRepository as any,
      leaveBalanceRepository as any,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLeaveRequest', () => {
    it('should throw BadRequestException if invalid date', async () => {
      await expect(service.createLeaveRequest('uid', { startDate: 'invalid', endDate: 'invalid', numberOfDays: 1, leaveType: 'ANNUAL' } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMyLeaveRequests', () => {
    it('should call find with userId', async () => {
      leaveRequestRepository.find.mockResolvedValue([]);
      await service.getMyLeaveRequests('uid');
      expect(leaveRequestRepository.find).toHaveBeenCalled();
    });
  });

  // Thêm test cho các hàm khác nếu cần
}); 