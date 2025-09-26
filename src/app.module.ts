import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { InventariosModule } from './inventarios/inventarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Configuración global de variables de entorno
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
      cache: true,
    }),
    
    // Base de datos centralizada
    DatabaseModule,
    
    // Configuración de rutas por defecto
    RouterModule.register([
      { path: 'usuarios', module: UsuariosModule },
      { path: 'inventarios', module: InventariosModule },
    ]),

    // Módulos de funcionalidad
    AuthModule,        // /auth/*
    UsuariosModule,    // /usuarios/*
    InventariosModule, // /inventarios/*
  ],
})
export class AppModule {}
