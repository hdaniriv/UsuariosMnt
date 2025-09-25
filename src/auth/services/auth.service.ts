import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsuarioEntity } from '../../database/entities/usuario.entity';
import { RoleEntity } from '../../database/entities/role.entity';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,

        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { roles = ['invitado'], ...userData } = registerDto;

        // 🛡️ RESTRICCIÓN: Solo permitir rol 'invitado' en registro público
        const allowedRoles = ['invitado'];
        const invalidRoles = roles.filter(role => !allowedRoles.includes(role));

        if (invalidRoles.length > 0) {
            throw new BadRequestException(
                `Registro público solo permite el rol 'invitado'. Roles no permitidos: ${invalidRoles.join(', ')}`
            );
        }

        // Verificar si el email ya existe
        const existingUser = await this.usuarioRepository.findOne({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new ConflictException('El correo electrónico ya está en uso');
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Buscar el rol invitado
        const userRoles = await this.roleRepository.find({
            where: roles.map((roleName: string) => ({ nombre: roleName })),
        });

        if (userRoles.length !== roles.length) {
            throw new NotFoundException('Rol no encontrado');
        }

        // Crear usuario
        const usuario = this.usuarioRepository.create({
            ...userData,
            password: hashedPassword,
            roles: userRoles,
        });

        const savedUser = await this.usuarioRepository.save(usuario);

        // Generar token
        const payload = {
            email: savedUser.email,
            sub: savedUser.id,
            roles: savedUser.getRoleNames()
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                name: savedUser.name,
                roles: savedUser.getRoleNames(),
            },
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        const usuario = await this.usuarioRepository.findOne({
            where: { email },
            relations: ['roles'],
        });

        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!usuario.activo) {
            throw new UnauthorizedException('Usuario inactivo');
        }

        usuario.ultimoLogin = new Date();
        await this.usuarioRepository.save(usuario);

        const payload = {
            email: usuario.email,
            sub: usuario.id,
            roles: usuario.getRoleNames()
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: usuario.id,
                email: usuario.email,
                name: usuario.name,
                roles: usuario.getRoleNames(),
            },
        };
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: userId },
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, usuario.password);
        if (!isOldPasswordValid) {
            throw new UnauthorizedException('La contraseña actual es incorrecta');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        usuario.password = hashedNewPassword;
        await this.usuarioRepository.save(usuario);
    }

    async validateUser(userId: number): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: userId },
            relations: ['roles'],
        });

        if (!usuario || !usuario.activo) {
            throw new UnauthorizedException('Usuario no válido');
        }

        return usuario;
    }
}