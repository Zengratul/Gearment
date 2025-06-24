import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enhanced CORS configuration for production
  const corsOrigins = configService.get('CORS_ORIGINS')?.split(',') || [
    'http://localhost:3000',
    'http://localhost:6000',
    'https://gearment-fe.minhviet.xyz'
  ];
  console.log('CORS Origins:', corsOrigins);
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With', 
      'Accept', 
      'Origin', 
      'Access-Control-Request-Method', 
      'Access-Control-Request-Headers',
      'Cookie',
      'Set-Cookie',
      'X-Forwarded-For',
      'X-Forwarded-Proto',
      'CF-Connecting-IP',
      'CF-Visitor'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Total-Count', 'Set-Cookie'],
    maxAge: 86400,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Gearment API')
      .setDescription('Leave Management System API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('PORT') || 5001;
  
  // Add retry logic for database connection
  let retries = 5;
  while (retries > 0) {
    try {
      await app.listen(port);
      console.log(`🚀 Application is running on: http://localhost:${port}`);
      console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
      console.log(`🌐 CORS Origins: ${corsOrigins.join(', ')}`);
      break;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error('Failed to start application after all retries:', error);
        process.exit(1);
      }
      console.log(`Failed to start application, retrying in 5 seconds... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

bootstrap(); 