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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { CategoriasService } from "../services/categorias.service";
import { ProductoCategoriaCreateDto } from "../dtos/productoCategoria-create.dto";
import { ProductoCategoriaUpdateDto } from "../dtos/productoCategoria-update.dto";

@ApiTags("Producto Categorías")
@Controller("categorias")
export class CategoriasController {
    constructor(private readonly categoriaService: CategoriasService) { }

    @Post()
    @ApiOperation({ summary: "Crear una nueva categoria de producto" })
    @ApiBody({
        description: "Datos necesarios para crear una categoria",
        type: ProductoCategoriaCreateDto,
    })
    create(@Body() categoriaCreateDto: ProductoCategoriaCreateDto) {
        return this.categoriaService.create(categoriaCreateDto);
    }

    @Get()
    @ApiOperation({ summary: "Lista todas las categorias de productos" })
    findAll() {
        return this.categoriaService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        const categoria = await this.categoriaService.findOne(Number(id));
        return categoria;
    }

    @Put(":id")
    update(
        @Param("id") id: string,
        @Body() categoriaUpdateDto: ProductoCategoriaUpdateDto
    ) {
        return this.categoriaService.update(Number(id), categoriaUpdateDto);
    }

    @Delete(":id")
    @HttpCode(204) // Cambia el código de estado a 204 que es una respuesta exitosa sin contenido
    delete(@Param("id") id: string) {
        return this.categoriaService.remove(Number(id));
    }
}
