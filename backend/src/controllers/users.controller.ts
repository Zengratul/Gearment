import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Create a new user with the provided information'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: User
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data' 
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Seed test users',
    description: 'Create test users for development'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Test users created successfully'
  })
  async seedUsers(): Promise<{ message: string; users: User[] }> {
    const testUsers = [
      {
        email: 'viet@gmail.com',
        password: '12345678',
        firstName: 'Viet',
        lastName: 'Nguyen',
        phoneNumber: '+84377771094',
        role: 'manager' as const,
      },
      {
        email: 'test@gmail.com',
        password: '12345678',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1234567891',
        role: 'employee' as const,
      },
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      try {
        const user = await this.usersService.create(userData);
        createdUsers.push(user);
      } catch (error) {
        // User might already exist, skip
        console.log(`User ${userData.email} might already exist`);
      }
    }

    return {
      message: 'Test users created successfully',
      users: createdUsers,
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieve a list of all users'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [User]
  })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    type: User
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update an existing user'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: User
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Delete an existing user'
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ 
    status: 204, 
    description: 'User deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found' 
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(id);
  }
} 