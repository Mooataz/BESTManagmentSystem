import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isProduction ? ['log', 'error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const config= new DocumentBuilder()
  .setTitle('BEST_Managment_System')
  .setDescription('Projet PFE')
  .addBearerAuth()
  .addBearerAuth(        // 👈 Obligatoire pour que Swagger affiche "Authorize"
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token',  )
  .build()
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const apiPort = process.env.API_PORT || '3000';
app.enableCors({
  origin: frontendUrl,
  credentials: true,
});
app.use(cookieParser());
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app ,document)
  
    

const uploadPath = isProduction
    ? join(__dirname, '..', 'upload')
    : join(__dirname, '..', '..', 'upload');

app.useStaticAssets(uploadPath, {
  prefix: '/upload/',
});
  await app.listen( apiPort);
    Logger.log(`Application is running on: http://localhost:${apiPort}`, 'Bootstrap');

}
bootstrap();
