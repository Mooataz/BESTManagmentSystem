import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Active tous les niveaux de logs
  });
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

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app ,document)
    // ⚠️ ICI : activer le CORS pour que React puisse appeler l'API
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
  
    

const uploadPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '..', 'upload') // dist en prod
    : join(__dirname, '..', '..', 'upload'); // src en dev

app.useStaticAssets(uploadPath, {
  prefix: '/upload/',
});
  await app.listen( 3000);
    Logger.log('Application is running on: http://localhost:3000', 'Bootstrap');

}
bootstrap();
