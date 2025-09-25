import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
    UseGuards,
    Put,
    Get
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from '../dtos/auth.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { UsuarioEntity } from '../../database/entities/usuario.entity';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ 
        summary: 'Registrar nuevo usuario',
        description: 'Solo se pueden registrar usuarios con rol: invitado'
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente',
        type: AuthResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Solo se permite rol invitado en registro público'
    })
    @ApiResponse({
        status: 409,
        description: 'El email ya está registrado'
    })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        type: AuthResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciales inválidas'
    })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @Put('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cambiar contraseña' })
    @ApiResponse({
        status: 200,
        description: 'Contraseña cambiada exitosamente'
    })
    @ApiResponse({
        status: 401,
        description: 'Contraseña actual incorrecta'
    })
    async changePassword(
        @GetUser('id') userId: number,
        @Body() changePasswordDto: ChangePasswordDto
    ): Promise<{ message: string }> {
        const { oldPassword, newPassword } = changePasswordDto;
        await this.authService.changePassword(userId, oldPassword, newPassword);
        return { message: 'Contraseña cambiada exitosamente' };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    @ApiResponse({
        status: 200,
        description: 'Perfil del usuario'
    })
    async getProfile(@GetUser() user: UsuarioEntity) {
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
}