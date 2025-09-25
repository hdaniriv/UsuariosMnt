import { IsString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductoCreateDto {
    @IsString()
    @ApiProperty({ description: 'Código del producto', example: 'P001' })
    @IsNotEmpty({ message: 'El código no puede estar vacío' })
    codigo!: string;

    @IsString()
    @ApiProperty({ description: 'Nombre del producto', example: 'Producto de ejemplo' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    name!: string;

    @IsString()
    @ApiProperty({ description: 'Descripción del producto', example: 'Descripción del producto de ejemplo' })
    @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
    descripcion!: string;

    @IsEnum(['unidad', 'litro', 'par', 'libra'])
    @ApiProperty({ description: 'Unidad de medida del producto', example: 'unidad' })
    unidadMedida!: 'unidad' | 'litro' | 'par' | 'libra';

    @IsNumber()
    @ApiProperty({ description: 'ID de la categoría del producto', example: 1 })
    idCategoria!: number;
}
