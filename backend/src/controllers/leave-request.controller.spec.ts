import { LeaveRequestController } from './leave-request.controller';
import { LeaveRequestService } from '../services/leave-request.service';
import { LeaveStatus, LeaveType } from '../entities/leave-request.entity';

describe('LeaveRequestController', () => {
  let controller: LeaveRequestController;
  let leaveRequestService: any;
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    leaveRequestService = {
      createLeaveRequest: jest.fn(),
      getMyLeaveRequests: jest.fn(),
      getAllLeaveRequests: jest.fn(),
      getLeaveRequestById: jest.fn(),
      updateLeaveRequestStatus: jest.fn(),
      deleteLeaveRequest: jest.fn(),
    };
    controller = new LeaveRequestController(leaveRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createLeaveRequest', () => {
    it('should call leaveRequestService.createLeaveRequest', async () => {
      const req = { user: { id: 'user1' } };
      const createLeaveRequestDto = { 
        startDate: '2024-01-01', 
        endDate: '2024-01-02', 
        numberOfDays: 1, 
        leaveType: LeaveType.ANNUAL,
        reason: 'Vacation'
      };
      leaveRequestService.createLeaveRequest.mockResolvedValue({ id: validUUID });
      
      await controller.createLeaveRequest(req, createLeaveRequestDto);
      
      expect(leaveRequestService.createLeaveRequest).toHaveBeenCalledWith('user1', createLeaveRequestDto);
    });
  });

  describe('getMyLeaveRequests', () => {
    it('should call leaveRequestService.getMyLeaveRequests', async () => {
      const req = { user: { id: 'user1' } };
      leaveRequestService.getMyLeaveRequests.mockResolvedValue([]);
      
      await controller.getMyLeaveRequests(req);
      
      expect(leaveRequestService.getMyLeaveRequests).toHaveBeenCalledWith('user1');
    });
  });

  describe('getAllLeaveRequests', () => {
    it('should call leaveRequestService.getAllLeaveRequests', async () => {
      const req = { user: { id: 'manager1' } };
      leaveRequestService.getAllLeaveRequests.mockResolvedValue([]);
      
      await controller.getAllLeaveRequests(req);
      
      expect(leaveRequestService.getAllLeaveRequests).toHaveBeenCalledWith('manager1');
    });
  });

  describe('getLeaveRequestById', () => {
    it('should call leaveRequestService.getLeaveRequestById', async () => {
      const req = { user: { id: 'user1' } };
      leaveRequestService.getLeaveRequestById.mockResolvedValue({ id: validUUID });
      
      await controller.getLeaveRequestById(req, validUUID);
      
      expect(leaveRequestService.getLeaveRequestById).toHaveBeenCalledWith(validUUID, 'user1');
    });
  });

  describe('updateLeaveRequestStatus', () => {
    it('should call leaveRequestService.updateLeaveRequestStatus', async () => {
      const req = { user: { id: 'manager1' } };
      const updateLeaveRequestDto = { status: LeaveStatus.APPROVED };
      leaveRequestService.updateLeaveRequestStatus.mockResolvedValue({ id: validUUID });
      
      await controller.updateLeaveRequestStatus(req, validUUID, updateLeaveRequestDto);
      
      expect(leaveRequestService.updateLeaveRequestStatus).toHaveBeenCalledWith(validUUID, 'manager1', updateLeaveRequestDto);
    });
  });

  describe('deleteLeaveRequest', () => {
    it('should call leaveRequestService.deleteLeaveRequest', async () => {
      const req = { user: { id: 'user1' } };
      leaveRequestService.deleteLeaveRequest.mockResolvedValue({ message: 'deleted' });
      
      await controller.deleteLeaveRequest(req, validUUID);
      
      expect(leaveRequestService.deleteLeaveRequest).toHaveBeenCalledWith('user1', validUUID);
    });
  });
}); 