import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsuarioEntity } from '../../database/entities/usuario.entity';

export interface JwtPayload {
    id: number;
    email: string;
    roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        });
    }

    async validate(payload: JwtPayload): Promise<UsuarioEntity> {
        const { id } = payload;

        const usuario = await this.usuarioRepository.findOne({
            where: { id, activo: true },
            relations: ['roles'],
        });

        if (!usuario) {
            throw new UnauthorizedException('Token no válido');
        }

        return usuario;
    }
}