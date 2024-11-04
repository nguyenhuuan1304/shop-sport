import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.use(cookieParser());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('My API SPORT')
    .setDescription('API NESTJS-SPORT')
    .setVersion('1.0')
    .addTag('API')
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 5000; 
  await app.listen(port, () => {
    console.log('Server is listening on port: ' + port); 
    console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
  });
}

bootstrap();
