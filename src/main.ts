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
  const environment = configService.get('NODE_ENV');

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Registrar filtro global con ConfigService
  app.useGlobalFilters(new TypeOrmExceptionFilter(configService));

  // Registrar un interceptor global
  app.useGlobalInterceptors(new GlobalPostInterceptor());

  // Swagger solo en desarrollo
  if (environment === 'development') {
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
  }

  // Iniciar el servidor
  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);

  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Entorno: ${environment}`);
  console.log(`Base de datos: ${configService.get('DB_DATABASE')}`);

  if (environment === 'development') {
    console.log(`Documentación disponible en http://localhost:${port}/api`);
    console.log(`Errores detallados activados`);
  }

  console.log(`Rutas: /auth, /usuarios, /inventarios`);
  console.log(`Para crear el primer admin, usa: npm run generate-admin`);
}

bootstrap();
