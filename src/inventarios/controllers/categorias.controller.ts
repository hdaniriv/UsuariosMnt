import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    ParseIntPipe,
    HttpCode,
    UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from "@nestjs/swagger";

import { CategoriasService } from "../services/categorias.service";
import { ProductoCategoriaCreateDto } from "../dtos/productoCategoria-create.dto";
import { ProductoCategoriaUpdateDto } from "../dtos/productoCategoria-update.dto";
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags("Gestión de Categorías")
@Controller("categorias")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CategoriasController {
    constructor(private readonly categoriaService: CategoriasService) { }

    @Post()
    @Roles('admin', 'moderador')
    @ApiOperation({ summary: "Crear una nueva categoria de producto (Admin/Moderador)" })
    @ApiBody({
        description: "Datos necesarios para crear una categoria",
        type: ProductoCategoriaCreateDto,
    })
    create(@Body() categoriaCreateDto: ProductoCategoriaCreateDto) {
        return this.categoriaService.create(categoriaCreateDto);
    }

    @Get()
    @Roles('admin', 'moderador', 'usuario')
    @ApiOperation({ summary: "Lista todas las categorias de productos (Todos los usuarios)" })
    findAll() {
        return this.categoriaService.findAll();
    }

    @Get(":id")
    @Roles('admin', 'moderador', 'usuario')
    @ApiOperation({ summary: "Obtener categoria por ID (Todos los usuarios)" })
    async findOne(@Param("id") id: string) {
        const categoria = await this.categoriaService.findOne(Number(id));
        return categoria;
    }

    @Put(":id")
    @Roles('admin', 'moderador')
    @ApiOperation({ summary: "Actualizar categoria (Admin/Moderador)" })
    update(
        @Param("id") id: string,
        @Body() categoriaUpdateDto: ProductoCategoriaUpdateDto
    ) {
        return this.categoriaService.update(Number(id), categoriaUpdateDto);
    }

    @Delete(":id")
    @Roles('admin')
    @ApiOperation({ summary: "Eliminar categoria (Solo Admin)" })
    @HttpCode(204) // Cambia el código de estado a 204 que es una respuesta exitosa sin contenido
    delete(@Param("id") id: string) {
        return this.categoriaService.remove(Number(id));
    }
}
