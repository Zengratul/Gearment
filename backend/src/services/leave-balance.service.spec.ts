import { LeaveBalanceService } from './leave-balance.service';
import { NotFoundException } from '@nestjs/common';
import { LeaveType } from '../entities/leave-request.entity';

describe('LeaveBalanceService', () => {
  let service: LeaveBalanceService;
  let leaveBalanceRepository: any;

  beforeEach(() => {
    leaveBalanceRepository = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    service = new LeaveBalanceService(leaveBalanceRepository as any);
  });

  describe('getUserLeaveBalances', () => {
    it('should call find with userId', async () => {
      leaveBalanceRepository.find.mockResolvedValue([]);
      await service.getUserLeaveBalances('uid');
      expect(leaveBalanceRepository.find).toHaveBeenCalled();
    });
  });

  describe('getLeaveBalanceByType', () => {
    it('should throw NotFoundException if not found', async () => {
      leaveBalanceRepository.findOne.mockResolvedValue(null);
      await expect(service.getLeaveBalanceByType('uid', LeaveType.ANNUAL)).rejects.toThrow(NotFoundException);
    });
  });

  // Thêm test cho các hàm khác nếu cần
}); 