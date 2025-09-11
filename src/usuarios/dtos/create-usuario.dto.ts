import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Perez' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name!: string;

  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password!: string;
}