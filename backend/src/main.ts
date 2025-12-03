import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config({ path: '.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser: false, // Required for Better Auth
  });

 
   app.enableCors({
     origin: [
       'http://localhost:7000',
       'http://10.30.167.157:7000',
       'http://192.168.2.16:7000',
       'https://acme-takehome.onrender.com',
     ],
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
     exposedHeaders: ['Set-Cookie'],
   });

  //  app.setGlobalPrefix('api/v1'); // ← THIS WAS MISSING — THEIR FRONTEND EXPECTS /api/...
app.use(cookieParser());

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
