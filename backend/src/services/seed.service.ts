import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { LeaveType } from '../entities/leave-request.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(LeaveBalance)
    private leaveBalanceRepository: Repository<LeaveBalance>,
  ) {}

  async onModuleInit() {
    // Add delay to ensure database is ready
    await this.waitForDatabase();
    await this.seedUsers();
    await this.seedLeaveBalances();
  }

  private async waitForDatabase(retries = 10, delay = 2000): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        // Try to query the users table to check if it exists
        await this.usersRepository.query('SELECT 1 FROM users LIMIT 1');
        this.logger.log('Database is ready');
        return;
      } catch (error) {
        this.logger.warn(`Database not ready, attempt ${i + 1}/${retries}. Retrying in ${delay}ms...`);
        if (i === retries - 1) {
          this.logger.error('Database connection failed after all retries');
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  private async seedUsers() {
    try {
      // Check if users already exist
      const existingUsers = await this.usersRepository.find();
      if (existingUsers.length > 0) {
        this.logger.log('Users already seeded, skipping...');
        return;
      }

      this.logger.log('Seeding users...');

      // Create test users with hashed passwords
      const password = '12345678';
      const hashedPassword = await bcrypt.hash(password, 10);

      const users = [
        {
          email: 'viet@gmail.com',
          password: hashedPassword,
          firstName: 'Viet',
          lastName: 'Nguyen',
          phoneNumber: '+84377771094',
          role: UserRole.MANAGER,
          isActive: true,
        },
        {
          email: 'test@gmail.com',
          password: hashedPassword,
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '+1234567891',
          role: UserRole.EMPLOYEE,
          isActive: true,
        },
      ];

      for (const userData of users) {
        const user = this.usersRepository.create(userData);
        await this.usersRepository.save(user);
        this.logger.log(`Created user: ${user.email}`);
      }

      this.logger.log('Users seeded successfully!');
    } catch (error) {
      this.logger.error('Error seeding users:', error.message);
      throw error;
    }
  }

  private async seedLeaveBalances() {
    try {
      // Check if leave balances already exist
      const existingBalances = await this.leaveBalanceRepository.find();
      if (existingBalances.length > 0) {
        this.logger.log('Leave balances already seeded, skipping...');
        return;
      }

      this.logger.log('Seeding leave balances...');

      // Get all users
      const users = await this.usersRepository.find();
      const currentYear = new Date().getFullYear();

      for (const user of users) {
        const leaveTypes = [LeaveType.ANNUAL, LeaveType.SICK, LeaveType.PERSONAL, LeaveType.MATERNITY, LeaveType.PATERNITY];
        
        for (const leaveType of leaveTypes) {
          // Skip maternity/paternity for non-managers (just as an example)
          if ((leaveType === LeaveType.MATERNITY || leaveType === LeaveType.PATERNITY) && user.role === UserRole.EMPLOYEE) {
            continue;
          }

          const totalDays = this.getDefaultLeaveDays(leaveType);
          const usedDays = Math.floor(Math.random() * Math.min(totalDays, 5)); // Random used days
          const remainingDays = totalDays - usedDays;

          const leaveBalance = this.leaveBalanceRepository.create({
            user: user,
            leaveType,
            totalDays,
            usedDays,
            remainingDays,
            year: currentYear,
          });

          await this.leaveBalanceRepository.save(leaveBalance);
        }
      }

      this.logger.log('Leave balances seeded successfully!');
    } catch (error) {
      this.logger.error('Error seeding leave balances:', error.message);
      throw error;
    }
  }

  private getDefaultLeaveDays(leaveType: LeaveType): number {
    switch (leaveType) {
      case LeaveType.ANNUAL:
        return 20;
      case LeaveType.SICK:
        return 10;
      case LeaveType.PERSONAL:
        return 5;
      case LeaveType.MATERNITY:
        return 90;
      case LeaveType.PATERNITY:
        return 14;
      default:
        return 0;
    }
  }
} 