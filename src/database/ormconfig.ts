import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

// Importar TODAS las entidades
import { UsuarioEntity } from "./entities/usuario.entity";
import { RoleEntity } from "./entities/role.entity";
import { ProductoEntity } from "./entities/producto.entity";
import { ProductoCategoriaEntity } from "./entities/productoCategoria.entity";

export const createOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const isProduction = configService.get("NODE_ENV") === "production";
  const isDevelopment = configService.get("NODE_ENV") === "development";
  const isTest = configService.get("NODE_ENV") === "test";

  return {
    type: "mysql",
    host: configService.get("DB_HOST"),
    port: +configService.get("DB_PORT"),
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    database: configService.get("DB_DATABASE"),

    // Entidades centralizadas
    entities: [
      UsuarioEntity,
      RoleEntity,
      ProductoEntity,
      ProductoCategoriaEntity,
    ],

   // Configuración esencial
    synchronize: isDevelopment,
    // logging: isDevelopment ? ["query", "error"] : false, // muestra queries SQL y consultas 
    logging: isDevelopment ? ["error"] : false,
    charset: "utf8mb4",

    // Pool mínimo sin advertencias
    extra: {
      connectionLimit: 10,
    },
  };
};


