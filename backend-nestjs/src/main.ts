import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  
    
  await app.listen( 3000);
}
bootstrap();
