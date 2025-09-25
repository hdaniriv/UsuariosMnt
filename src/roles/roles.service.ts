import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '../database/entities/role.entity';

export interface CreateRoleDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateRoleDto {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { nombre, descripcion } = createRoleDto;

    // Verificar si el role ya existe
    const existingRole = await this.roleRepository.findOne({
      where: { nombre },
    });

    if (existingRole) {
      throw new ConflictException('El rol ya existe');
    }

    const role = this.roleRepository.create({
      nombre,
      descripcion,
    });

    return this.roleRepository.save(role);
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { id, activo: true },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async findByName(nombre: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: { nombre, activo: true },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);

    // Si se quiere cambiar el nombre, verificar que no exista otro con ese nombre
    if (updateRoleDto.nombre && updateRoleDto.nombre !== role.nombre) {
      const existingRole = await this.roleRepository.findOne({
        where: { nombre: updateRoleDto.nombre },
      });

      if (existingRole) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    
    // Soft delete - solo marcar como inactivo
    role.activo = false;
    await this.roleRepository.save(role);
  }

  async seedInitialRoles(): Promise<void> {
    const rolesToCreate = [
      { nombre: 'admin', descripcion: 'Administrador del sistema con todos los permisos' },
      { nombre: 'moderador', descripcion: 'Moderador con permisos de gestión limitados' },
      { nombre: 'usuario', descripcion: 'Usuario básico del sistema' },
    ];

    for (const roleData of rolesToCreate) {
      const existingRole = await this.roleRepository.findOne({
        where: { nombre: roleData.nombre },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }
  }
}