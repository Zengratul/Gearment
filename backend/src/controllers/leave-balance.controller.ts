import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LeaveBalanceService } from '../services/leave-balance.service';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { AuthGuard } from '../guards/auth.guard';

@ApiTags('Leave Balance')
@Controller('leave-balance')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class LeaveBalanceController {
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  @Get()
  @ApiOperation({ summary: 'Show available leave days' })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Year to get leave balance for (defaults to current year)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User leave balances',
    type: [LeaveBalance],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserLeaveBalances(
    @Request() req,
    @Query('year') year?: number,
  ): Promise<LeaveBalance[]> {
    return this.leaveBalanceService.getUserLeaveBalances(req.user.id, year);
  }
} 