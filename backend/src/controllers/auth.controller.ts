import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticate user with email and password'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: LoginResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid input data' 
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Logout user and invalidate session'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Logout successful',
    schema: {
      example: {
        message: 'Successfully logged out'
      }
    }
  })
  async logout(): Promise<{ message: string }> {
    // This is a placeholder implementation
    return { message: 'Successfully logged out' };
  }
} 