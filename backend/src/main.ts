import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';


dotenv.config({ path: '.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser: false, // Required for Better Auth
  });

 
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5001',
        'http://localhost:7000',
        'https://acme-backend-jl77.onrender.com',
        'https://acme-takehome.onrender.com',
        'http://10.30.167.157:7000',
      ],
      credentials: true,
      
    });

   app.setGlobalPrefix('api/v1'); // ← THIS WAS MISSING — THEIR FRONTEND EXPECTS /api/...

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 5001);
  
  
}
bootstrap();
