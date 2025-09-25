import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token!: string;

  @ApiProperty({
    description: 'Información del usuario autenticado'
  })
  user!: {
    id: number;
    name: string;
    email: string;
    roles: string[];
  };
}

export class UserProfileDto {
  @ApiProperty({ description: 'ID del usuario' })
  id!: number;

  @ApiProperty({ description: 'Nombre del usuario' })
  name!: string;

  @ApiProperty({ description: 'Email del usuario' })
  email!: string;

  @ApiProperty({ description: 'Roles del usuario', type: [String] })
  roles!: string[];

  @ApiProperty({ description: 'Fecha del último login', required: false })
  ultimoLogin?: Date;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt!: Date;
}