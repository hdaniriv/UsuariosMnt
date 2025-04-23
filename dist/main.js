"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const global_post_interceptor_1 = require("./interceptors/global-post-interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Habilitar validaciones globales con whitelist
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true, // Opcional: Lanza un error si se envían campos no permitidos
    }));
    app.useGlobalInterceptors(new global_post_interceptor_1.GlobalPostInterceptor());
    await app.listen(3000);
}
bootstrap();
