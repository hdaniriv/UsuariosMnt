import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DatabaseModule } from './database/database.module';
import { InventariosModule } from './inventarios/inventarios.module';
import { RouterModule } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles globalmente
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),  
    UsuariosModule,
    DatabaseModule,
    InventariosModule,
    RouterModule.register([
      {
        path: 'usuarios',
        module: UsuariosModule,
      },
      {
        path: 'inventarios',
        module: InventariosModule,
      },
    ]),
  ],  
},

)
export class AppModule {}
