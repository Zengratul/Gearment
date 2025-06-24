import { LeaveBalanceController } from './leave-balance.controller';
import { LeaveBalanceService } from '../services/leave-balance.service';

describe('LeaveBalanceController', () => {
  let controller: LeaveBalanceController;
  let leaveBalanceService: any;

  beforeEach(() => {
    leaveBalanceService = {
      getUserLeaveBalances: jest.fn(),
    };
    controller = new LeaveBalanceController(leaveBalanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserLeaveBalances', () => {
    it('should call leaveBalanceService.getUserLeaveBalances', async () => {
      const req = { user: { id: 'user1' } };
      leaveBalanceService.getUserLeaveBalances.mockResolvedValue([]);
      
      await controller.getUserLeaveBalances(req);
      
      expect(leaveBalanceService.getUserLeaveBalances).toHaveBeenCalledWith('user1', undefined);
    });

    it('should call leaveBalanceService.getUserLeaveBalances with year', async () => {
      const req = { user: { id: 'user1' } };
      leaveBalanceService.getUserLeaveBalances.mockResolvedValue([]);
      
      await controller.getUserLeaveBalances(req, 2024);
      
      expect(leaveBalanceService.getUserLeaveBalances).toHaveBeenCalledWith('user1', 2024);
    });
  });
}); 