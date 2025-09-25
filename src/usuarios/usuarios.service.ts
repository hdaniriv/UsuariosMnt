import { Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../database/entities/usuario.entity';
import { RoleEntity } from '../database/entities/role.entity';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioEntity> {
    const { email, roles: roleNames = ['usuario'], ...userData } = createUsuarioDto;

    // Verificar si el email ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Buscar los roles especificados
    const userRoles = await this.roleRepository.find({
      where: roleNames.map((roleName: string) => ({ nombre: roleName })),
    });

    if (userRoles.length !== roleNames.length) {
      throw new NotFoundException('Uno o más roles no existen');
    }

    const usuario = this.usuarioRepository.create({
      ...userData,
      email,
      roles: userRoles,
    });
    
    return await this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<UsuarioEntity[]> {
    return this.usuarioRepository.find({
      relations: ['roles'],
      where: { activo: true },
    });
  }

  async findOne(id: number): Promise<UsuarioEntity> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioEntity> {
    // Buscar el usuario existente con sus roles
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const { roles: roleNames, ...userData } = updateUsuarioDto;

    // Actualizar los campos básicos
    Object.assign(usuario, userData);

    // Si se especifican roles, buscar las entidades correspondientes
    if (roleNames && roleNames.length > 0) {
      const rolesEntities = await this.roleRepository.find({
        where: roleNames.map((roleName: string) => ({ nombre: roleName })),
      });

      if (rolesEntities.length !== roleNames.length) {
        throw new NotFoundException('Uno o más roles no existen');
      }

      usuario.roles = rolesEntities;
    }

    // Guardar el usuario actualizado
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    
    // Soft delete - marcar como inactivo en lugar de eliminar
    usuario.activo = false;
    await this.usuarioRepository.save(usuario);
  }
}