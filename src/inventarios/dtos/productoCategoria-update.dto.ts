import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductoCategoriaUpdateDto {
    @ApiProperty({ description: 'Nombre de categoria', example: 'comestibles' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    name!: string;
}