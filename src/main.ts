import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TypeOrmExceptionFilter } from "./database/filters/typeorm-exception.filter";
import { GlobalPostInterceptor } from "./interceptors/global-post-interceptor";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener ConfigService
  const configService = app.get(ConfigService);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // 🔧 Registrar filtro global con ConfigService
  app.useGlobalFilters(new TypeOrmExceptionFilter(configService));

  // Registrar un interceptor global
  app.useGlobalInterceptors(new GlobalPostInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("UserMnt API")
    .setDescription("API para gestión de usuarios con autenticación JWT y roles")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Iniciar el servidor
  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📄 Documentación disponible en http://localhost:${port}/api`);
  console.log(`🔗 Rutas: /auth, /usuarios, /inventarios`);
  console.log(`🔐 Sistema de autenticación JWT habilitado`);
  console.log(`👑 Para crear el primer admin, usa: npm run generate-admin`);
  console.log(`🐞 Modo: ${configService.get('NODE_ENV')} - ${configService.get('NODE_ENV') === 'development' ? 'Errores detallados activados' : 'Errores ocultados'}`);
}

bootstrap();
