import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { ProductoEntity } from './entities/producto.entity';

ConfigModule.forRoot({
  isGlobal: true, // Hace que las variables estén disponibles globalmente
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Carga el archivo .env según el entorno
});

const configService = new ConfigService();

export const ormConfig = {
  type: configService.get<string>('DB_TYPE') as 'mysql' | 'mariadb' | 'postgres' | 'cockroachdb' | 'sqlite' | 'mssql' | 'sap' | 'oracle' | 'cordova' | 'nativescript' | 'react-native' | 'sqljs' | 'mongodb' | 'aurora-mysql' | 'aurora-postgres' | 'expo' | undefined,
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [UsuarioEntity, ProductoEntity],
  autoLoadEntities: true,
  synchronize: configService.get<string>('NODE_ENV') === 'development', // Solo habilita synchronize en desarrollo
  logging: configService.get<boolean>('TYPEORM_LOGGING') || false, // Controla los logs desde .env
} as TypeOrmModuleOptions;