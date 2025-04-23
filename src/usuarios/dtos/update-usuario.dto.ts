import { IsNotEmpty } from 'class-validator';

export class UpdateUsuarioDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name?: string;

  @IsNotEmpty({ message: 'El password no puede estar vacío' })
  password?: string;
}