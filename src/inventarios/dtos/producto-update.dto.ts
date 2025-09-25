import { IsString, IsEnum, IsOptional } from 'class-validator';

export class ProductoUpdateDto {
  @IsString()
  @IsOptional()
  codigo!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  descripcion!: string;

  @IsEnum(['unidad', 'litro', 'par', 'libra'])
  @IsOptional()
  unidadMedida!: 'unidad' | 'litro' | 'par' | 'libra';

  @IsOptional()
  idCategoria!: number;
}
