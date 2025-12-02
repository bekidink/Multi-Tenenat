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
    origin: true,
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

  await app.listen(3000);
  
  
}
bootstrap();
