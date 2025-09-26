import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createOrmConfig } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = createOrmConfig(configService);
        
        // Log de configuración en desarrollo
        if (configService.get('NODE_ENV') === 'development') {
          console.log('Configuración de Base de Datos:');
          console.log(`   Host: ${configService.get('DB_HOST')}:${configService.get('DB_PORT')}`);
          console.log(`   Database: ${configService.get('DB_DATABASE')}`);
          console.log(`   Synchronize: ${config.synchronize}`);
          console.log(`   Logging: ${Array.isArray(config.logging) ? config.logging.join(',') : config.logging}`);
          console.log(`   Entidades: ${config.entities?.length} registradas`);
        }
        
        return config;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
