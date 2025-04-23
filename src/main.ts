import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalPostInterceptor } from './interceptors/global-post-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validaciones globales con whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina automáticamente campos no definidos en los DTOs
      forbidNonWhitelisted: true, // Opcional: Lanza un error si se envían campos no permitidos

    }),
  );

  app.useGlobalInterceptors(new GlobalPostInterceptor());

  await app.listen(3000);
}
bootstrap();


