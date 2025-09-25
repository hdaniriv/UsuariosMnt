import {
    Injectable,
    NotFoundException,
    ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductoCategoriaEntity } from "@entities/productoCategoria.entity";
import { ProductoCategoriaCreateDto } from "../dtos/productoCategoria-create.dto";
import { ProductoCategoriaUpdateDto } from "../dtos/productoCategoria-update.dto";

@Injectable()
export class CategoriasService {
    constructor(
        @InjectRepository(ProductoCategoriaEntity)
        private readonly categoriaRepository: Repository<ProductoCategoriaEntity>
    ) {}

    async create(data: ProductoCategoriaCreateDto): Promise<ProductoCategoriaEntity> {       
        const categoria = this.categoriaRepository.create(data);
        return await this.categoriaRepository.save(categoria);       
    }

    async findAll(): Promise<ProductoCategoriaEntity[]> {
        //return this.categoriaRepository.find({ relations: ["productos"] }); // Con relaciones
        return this.categoriaRepository.find(); // Sin relaciones
    }

    async findOne(id: number): Promise<ProductoCategoriaEntity> {
        const categoria = await this.categoriaRepository.findOne({
            where: { id },
        relations: ["productos"],
        });
        if (!categoria) {
            throw new NotFoundException(`La categoría con id ${id} no existe`);
        }
        return categoria;
    }
    async update(id: number,data: ProductoCategoriaUpdateDto): Promise<ProductoCategoriaEntity> {
        await this.categoriaRepository.update(id, data);
        return this.findOne(id);  
    }

    async remove(id: number): Promise<void> {
        await this.categoriaRepository.delete(id);
    }

}
