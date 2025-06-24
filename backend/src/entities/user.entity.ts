import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LeaveRequest } from './leave-request.entity';
import { LeaveBalance } from './leave-balance.entity';

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.user)
  leaveRequests: LeaveRequest[];

  @OneToMany(() => LeaveBalance, (leaveBalance) => leaveBalance.user)
  leaveBalances: LeaveBalance[];
} 