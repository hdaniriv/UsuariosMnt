import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UsuarioEntity } from '../database/entities/usuario.entity';
import { RoleEntity } from '../database/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, RoleEntity])], // Registra ambos repositorios
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Exporta el servicio si es necesario en otros módulos
})
export class UsuariosModule {}