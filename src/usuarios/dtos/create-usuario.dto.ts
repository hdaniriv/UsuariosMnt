import { IsNotEmpty, IsEmail, IsOptional, IsArray, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Perez' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name!: string;

  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @ApiProperty({ 
    description: 'Roles asignados al usuario',
    example: ['usuario'],
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray({ message: 'Los roles deben ser un array' })
  @IsString({ each: true, message: 'Cada rol debe ser un texto' })
  roles?: string[];
}