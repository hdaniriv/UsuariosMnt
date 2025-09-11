import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { ApiBody,ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('usuarios')
@ApiTags('usuarios  end point cito')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({
    description: 'Datos necesarios para crear un usuario',
    type: CreateUsuarioDto,
  })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos los usuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuariosService.findOne(Number(id));
   /*  toda la logica y las excepciones se manejan en el servicio*/
    return usuario;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(Number(id), updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(204) // Cambia el código de estado a 204 que es una respuesta exitosa sin contenido
  delete(@Param('id') id: string) {
    return this.usuariosService.remove(Number(id));
  }
}