import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { GlobalPostInterceptor } from "./interceptors/global-post-interceptor";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener el puerto desde el archivo .env usando ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 3000; // Usa 3000 como valor predeterminado

  // Habilitar validaciones globales con whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina automáticamente campos no definidos en los DTOs
      forbidNonWhitelisted: true, // Lanza un error si se envían campos no permitidos
    })
  );

  // Registrar un interceptor global
  app.useGlobalInterceptors(new GlobalPostInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("User Management API")
    .setDescription("API para gestionar usuarios y productos")
    .setVersion("1.0")
    .addBearerAuth() // Agrega soporte para autenticación con Bearer Token
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Iniciar el servidor
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📄 Documentación disponible en http://localhost:${port}/api`);
}
bootstrap();
