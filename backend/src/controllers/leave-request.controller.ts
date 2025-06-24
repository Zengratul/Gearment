import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveRequestService } from '../services/leave-request.service';
import { CreateLeaveRequestDto } from '../dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from '../dto/update-leave-request.dto';
import { LeaveRequest } from '../entities/leave-request.entity';
import { AuthGuard } from '../guards/auth.guard';
import { validateUUID } from '../utils/uuid-validation.util';

@ApiTags('Leave Requests')
@Controller('leave-request')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new leave request' })
  @ApiResponse({
    status: 201,
    description: 'Leave request created successfully',
    type: LeaveRequest,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createLeaveRequest(
    @Request() req,
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.leaveRequestService.createLeaveRequest(req.user.id, createLeaveRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'View your own leave requests' })
  @ApiResponse({
    status: 200,
    description: 'List of user leave requests',
    type: [LeaveRequest],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyLeaveRequests(@Request() req): Promise<LeaveRequest[]> {
    return this.leaveRequestService.getMyLeaveRequests(req.user.id);
  }

  @Get('all')
  @ApiOperation({ summary: 'View all leave requests (managers only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all leave requests',
    type: [LeaveRequest],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - managers only' })
  async getAllLeaveRequests(@Request() req): Promise<LeaveRequest[]> {
    return this.leaveRequestService.getAllLeaveRequests(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific leave request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Leave request details',
    type: LeaveRequest,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not authorized to view' })
  @ApiResponse({ status: 404, description: 'Leave request not found' })
  async getLeaveRequestById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<LeaveRequest> {
    validateUUID(id, 'leave request ID');
    return this.leaveRequestService.getLeaveRequestById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve/reject leave request (managers only)' })
  @ApiResponse({
    status: 200,
    description: 'Leave request status updated successfully',
    type: LeaveRequest,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - managers only' })
  @ApiResponse({ status: 404, description: 'Leave request not found' })
  async updateLeaveRequestStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    validateUUID(id, 'leave request ID');
    return this.leaveRequestService.updateLeaveRequestStatus(
      id,
      req.user.id,
      updateLeaveRequestDto,
    );
  }

  @Delete(':id')
  async deleteLeaveRequest(@Request() req, @Param('id') id: string) {
    return this.leaveRequestService.deleteLeaveRequest(req.user.id, id);
  }
} 