import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { LeaveType } from '../entities/leave-request.entity';

@Injectable()
export class LeaveBalanceService {
  constructor(
    @InjectRepository(LeaveBalance)
    private leaveBalanceRepository: Repository<LeaveBalance>,
  ) {}

  async getUserLeaveBalances(userId: string, year?: number): Promise<LeaveBalance[]> {
    const currentYear = year || new Date().getFullYear();
    
    return this.leaveBalanceRepository.find({
      where: { userId, year: currentYear },
      order: { leaveType: 'ASC' },
    });
  }

  async getLeaveBalanceByType(userId: string, leaveType: LeaveType, year?: number): Promise<LeaveBalance> {
    const currentYear = year || new Date().getFullYear();
    
    const leaveBalance = await this.leaveBalanceRepository.findOne({
      where: { userId, leaveType, year: currentYear },
    });

    if (!leaveBalance) {
      throw new NotFoundException(`Leave balance not found for type ${leaveType} in year ${currentYear}`);
    }

    return leaveBalance;
  }

  async createOrUpdateLeaveBalance(
    userId: string,
    leaveType: LeaveType,
    totalDays: number,
    year?: number,
  ): Promise<LeaveBalance> {
    const currentYear = year || new Date().getFullYear();
    
    let leaveBalance = await this.leaveBalanceRepository.findOne({
      where: { userId, leaveType, year: currentYear },
    });

    if (leaveBalance) {
      // Update existing balance
      leaveBalance.totalDays = totalDays;
      leaveBalance.remainingDays = totalDays - leaveBalance.usedDays;
    } else {
      // Create new balance
      leaveBalance = this.leaveBalanceRepository.create({
        userId,
        leaveType,
        totalDays,
        usedDays: 0,
        remainingDays: totalDays,
        year: currentYear,
      });
    }

    return this.leaveBalanceRepository.save(leaveBalance);
  }

  async initializeDefaultLeaveBalances(userId: string, year?: number): Promise<LeaveBalance[]> {
    const currentYear = year || new Date().getFullYear();
    const leaveTypes = Object.values(LeaveType);
    const defaultBalances = [];

    for (const leaveType of leaveTypes) {
      let totalDays = 0;
      
      // Set default days based on leave type
      switch (leaveType) {
        case LeaveType.ANNUAL:
          totalDays = 20;
          break;
        case LeaveType.SICK:
          totalDays = 10;
          break;
        case LeaveType.PERSONAL:
          totalDays = 5;
          break;
        case LeaveType.MATERNITY:
          totalDays = 90;
          break;
        case LeaveType.PATERNITY:
          totalDays = 14;
          break;
      }

      const leaveBalance = await this.createOrUpdateLeaveBalance(userId, leaveType, totalDays, currentYear);
      defaultBalances.push(leaveBalance);
    }

    return defaultBalances;
  }
} 