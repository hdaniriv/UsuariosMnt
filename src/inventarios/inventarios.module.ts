import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasController } from './controllers/categorias.controller';
import { ProductosController } from './controllers/productos.controller';
import { CategoriasService } from './services/categorias.service';
import { ProductosService } from './services/productos.service';
import { ProductoCategoriaEntity } from '@entities/productoCategoria.entity';
import { ProductoEntity } from '@entities/producto.entity';


@Module({
  imports: [TypeOrmModule.forFeature([ProductoCategoriaEntity, ProductoEntity])],
  controllers: [CategoriasController, ProductosController],
  providers: [CategoriasService, ProductosService],
  exports: [CategoriasService, ProductosService],
})
export class InventariosModule {}
