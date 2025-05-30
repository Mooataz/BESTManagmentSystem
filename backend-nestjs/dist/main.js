"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('BEST_Managment_System')
        .setDescription('Projet PFE')
        .addBearerAuth()
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
    }, 'access-token')
        .build();
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });
    app.use(cookieParser());
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });
    const uploadPath = process.env.NODE_ENV === 'production'
        ? (0, path_1.join)(__dirname, '..', 'upload')
        : (0, path_1.join)(__dirname, '..', '..', 'upload');
    app.useStaticAssets(uploadPath, {
        prefix: '/upload/',
    });
    await app.listen(3000);
    common_1.Logger.log('Application is running on: http://localhost:3000', 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map