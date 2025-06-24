import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { LeaveType } from './leave-request.entity';

@Entity('leave_balances')
export class LeaveBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: LeaveType,
  })
  leaveType: LeaveType;

  @Column({ type: 'int', default: 0 })
  totalDays: number;

  @Column({ type: 'int', default: 0 })
  usedDays: number;

  @Column({ type: 'int', default: 0 })
  remainingDays: number;

  @Column({ type: 'int' })
  year: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.leaveBalances)
  @JoinColumn({ name: 'userId' })
  user: User;
} 