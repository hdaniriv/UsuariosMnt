import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name!: string;

  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password!: string;
}