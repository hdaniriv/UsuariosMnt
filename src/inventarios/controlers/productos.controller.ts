import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { ProductosService } from '../services/productos.service';
import { ProductoCreateDto } from '../dtos/producto-create.dto';
import { ProductoUpdateDto } from '../dtos/producto-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('productos')
@ApiTags('Gestión de Productos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductosController {
    constructor(private readonly productosService: ProductosService) { }

    @ApiOperation({ summary: 'Crea un nuevo producto (Admin/Moderador)' })
    @Post()
    @Roles('admin', 'moderador')
    create(@Body() data: ProductoCreateDto) {
        return this.productosService.create(data);
    }

    @ApiOperation({ summary: 'Obtiene todos los productos (Todos los usuarios)' })
    @Get()
    @Roles('admin', 'moderador', 'usuario')
    findAll() {
        return this.productosService.findAll();
    }

    @ApiOperation({ summary: 'Obtiene un producto por ID (Todos los usuarios)' })
    @Get(':id')
    @Roles('admin', 'moderador', 'usuario')
    findOne(@Param('id') id: number) {
        return this.productosService.findOne(Number(id));
    }

    @ApiOperation({ summary: 'Actualiza un producto por ID (Admin/Moderador)' })
    @Patch(':id')
    @Roles('admin', 'moderador')
    update(@Param('id') id: number, @Body() data: ProductoUpdateDto) {
        return this.productosService.update(Number(id), data);
    }

    @ApiOperation({ summary: 'Elimina un producto por ID (Solo Admin)' })
    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id: number) {
        return this.productosService.remove(Number(id));
    }
}
