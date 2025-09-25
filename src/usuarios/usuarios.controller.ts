import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpCode,
  UseGuards 
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsuarioEntity } from '../database/entities/usuario.entity';

@Controller('usuarios')
@ApiTags('Gestión de Usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Crear un nuevo usuario (Admin/Moderador)' })
  @ApiBody({
    description: 'Datos necesarios para crear un usuario',
    type: CreateUsuarioDto,
  })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Lista todos los usuarios (Admin/Moderador)' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get('mi-perfil')
  @ApiOperation({ summary: 'Obtener mi perfil (Usuario autenticado)' })
  async getMyProfile(@GetUser() user: UsuarioEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.getRoleNames(),
      ultimoLogin: user.ultimoLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Get(':id')
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Obtener usuario por ID (Admin/Moderador)' })
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuariosService.findOne(Number(id));
    /*  toda la logica y las excepciones se manejan en el servicio*/
    return usuario;
  }

  @Put(':id')
  @Roles('admin', 'moderador')
  @ApiOperation({ summary: 'Actualizar usuario (Admin/Moderador)' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(Number(id), updateUsuarioDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar usuario (Solo Admin)' })
  @HttpCode(204) // Cambia el código de estado a 204 que es una respuesta exitosa sin contenido
  delete(@Param('id') id: string) {
    return this.usuariosService.remove(Number(id));
  }
}