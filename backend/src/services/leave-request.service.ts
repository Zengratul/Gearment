import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveStatus } from '../entities/leave-request.entity';
import { User, UserRole } from '../entities/user.entity';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { CreateLeaveRequestDto } from '../dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from '../dto/update-leave-request.dto';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(LeaveBalance)
    private leaveBalanceRepository: Repository<LeaveBalance>,
  ) {}

  async createLeaveRequest(userId: string, createLeaveRequestDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const { startDate, endDate, numberOfDays, leaveType } = createLeaveRequestDto;

    // Validate dates
    let start: Date;
    let end: Date;
    
    try {
      start = new Date(startDate);
      end = new Date(endDate);
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format provided');
      }
    } catch (error) {
      throw new BadRequestException('Invalid date format provided');
    }
    
    // Normalize dates to start of day for comparison
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(end);
    endOfDay.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startOfDay > endOfDay) {
      throw new BadRequestException('Start date must be before or equal to end date');
    }

    if (startOfDay < today) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Check leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await this.leaveBalanceRepository.findOne({
      where: { userId, leaveType, year: currentYear }
    });

    if (!leaveBalance) {
      throw new BadRequestException(`No leave balance found for ${leaveType} leave type`);
    }

    if (leaveBalance.remainingDays < numberOfDays) {
      throw new BadRequestException(`Insufficient leave balance. You have ${leaveBalance.remainingDays} days remaining but requested ${numberOfDays} days`);
    }

    const leaveRequest = this.leaveRequestRepository.create({
      ...createLeaveRequestDto,
      userId,
      startDate: start,
      endDate: end,
    });

    return this.leaveRequestRepository.save(leaveRequest);
  }

  async getMyLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: { userId },
      relations: ['user', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllLeaveRequests(managerId: string): Promise<LeaveRequest[]> {
    // Verify manager role
    const manager = await this.userRepository.findOne({ where: { id: managerId } });
    if (!manager || manager.role !== UserRole.MANAGER) {
      throw new ForbiddenException('Only managers can view all leave requests');
    }

    return this.leaveRequestRepository.find({
      relations: ['user', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateLeaveRequestStatus(
    requestId: string,
    managerId: string,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    // Verify manager role
    const manager = await this.userRepository.findOne({ where: { id: managerId } });
    if (!manager || manager.role !== UserRole.MANAGER) {
      throw new ForbiddenException('Only managers can approve/reject leave requests');
    }

    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request has already been processed');
    }

    const { status, rejectionReason } = updateLeaveRequestDto;

    if (status === LeaveStatus.REJECTED && !rejectionReason) {
      throw new BadRequestException('Rejection reason is required when rejecting a leave request');
    }

    // Update leave request
    leaveRequest.status = status;
    leaveRequest.approvedBy = managerId;
    if (rejectionReason) {
      leaveRequest.rejectionReason = rejectionReason;
    }

    // If approved, update leave balance
    if (status === LeaveStatus.APPROVED) {
      const currentYear = new Date().getFullYear();
      const leaveBalance = await this.leaveBalanceRepository.findOne({
        where: { 
          userId: leaveRequest.userId, 
          leaveType: leaveRequest.leaveType, 
          year: currentYear 
        }
      });

      if (leaveBalance) {
        leaveBalance.usedDays += leaveRequest.numberOfDays;
        leaveBalance.remainingDays = leaveBalance.totalDays - leaveBalance.usedDays;
        await this.leaveBalanceRepository.save(leaveBalance);
      }
    }

    return this.leaveRequestRepository.save(leaveRequest);
  }

  async getLeaveRequestById(requestId: string, userId: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user', 'approver'],
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    // Check if user is authorized to view this request
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (leaveRequest.userId !== userId && user?.role !== UserRole.MANAGER) {
      throw new ForbiddenException('You are not authorized to view this leave request');
    }

    return leaveRequest;
  }

  async deleteLeaveRequest(userId: string, requestId: string): Promise<{ message: string }> {
    const leaveRequest = await this.leaveRequestRepository.findOne({ where: { id: requestId } });
    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }
    // Kiểm tra quyền: chỉ owner (employee) được xóa nếu là pending, manager được xóa bất kỳ
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    if (user.role === 'manager') {
      // Manager được xóa bất kỳ request nào
      await this.leaveRequestRepository.delete(requestId);
      return { message: 'Leave request deleted successfully' };
    }
    // Employee chỉ được xóa request của mình và phải là pending
    if (leaveRequest.userId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this leave request');
    }
    if (leaveRequest.status !== 'pending') {
      throw new ForbiddenException('You can only delete leave requests that are pending');
    }
    await this.leaveRequestRepository.delete(requestId);
    return { message: 'Leave request deleted successfully' };
  }
} 