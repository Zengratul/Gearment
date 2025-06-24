import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDateString, IsInt, IsString, Min, Max, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { LeaveType } from '../entities/leave-request.entity';

export class CreateLeaveRequestDto {
  @ApiProperty({
    description: 'Type of leave request',
    enum: LeaveType,
    example: LeaveType.ANNUAL
  })
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @ApiProperty({
    description: 'Start date of leave (ISO date string)',
    example: '2024-01-15'
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'End date of leave (ISO date string)',
    example: '2024-01-20'
  })
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @ApiProperty({
    description: 'Number of days for leave',
    example: 5,
    minimum: 1,
    maximum: 365
  })
  @IsInt()
  @Min(1)
  @Max(365)
  numberOfDays: number;

  @ApiProperty({
    description: 'Reason for leave request',
    example: 'Family vacation'
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
} 