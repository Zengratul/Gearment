import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { LeaveRequestController } from './controllers/leave-request.controller';
import { LeaveBalanceController } from './controllers/leave-balance.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { LeaveRequestService } from './services/leave-request.service';
import { LeaveBalanceService } from './services/leave-balance.service';
import { SeedService } from './services/seed.service';
import { User } from './entities/user.entity';
import { LeaveRequest } from './entities/leave-request.entity';
import { LeaveBalance } from './entities/leave-balance.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'gearment',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([User, LeaveRequest, LeaveBalance]),
  ],
  controllers: [
    AppController, 
    UsersController, 
    AuthController, 
    LeaveRequestController, 
    LeaveBalanceController
  ],
  providers: [
    AppService, 
    UsersService, 
    AuthService,
    LeaveRequestService, 
    LeaveBalanceService,
    SeedService
  ],
})
export class AppModule {} 