import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasController } from './controlers/categorias.controller';
import { CategoriasService } from './services/categorias.service';
import { ProductoCategoriaEntity } from '@entities/productoCategoria.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProductoCategoriaEntity])], // Registra el repositorio
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService], 
})
export class InventariosModule {}
