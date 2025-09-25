import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';

import { UsuariosModule } from './usuarios/usuarios.module';
import { InventariosModule } from './inventarios/inventarios.module';
import { AuthModule } from './auth/auth.module';

// Entidades
import { UsuarioEntity } from './database/entities/usuario.entity';
import { RoleEntity } from './database/entities/role.entity';
import { ProductoEntity } from './database/entities/producto.entity';
import { ProductoCategoriaEntity } from './database/entities/productoCategoria.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [UsuarioEntity, RoleEntity, ProductoEntity, ProductoCategoriaEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
 RouterModule.register([
      {
        path: 'usuarios',    // ← Prefijo para UsuariosModule
        module: UsuariosModule,
      },
      {
        path: 'inventarios', // ← Prefijo para InventariosModule
        module: InventariosModule,
      },
    ]),

    AuthModule,
    UsuariosModule,
    InventariosModule,
  ],
})
export class AppModule {}
