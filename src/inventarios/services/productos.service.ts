import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductoEntity } from "@entities/producto.entity";
import { ProductoCreateDto } from "../dtos/producto-create.dto";
import { ProductoUpdateDto } from "../dtos/producto-update.dto";

@Injectable()
export class ProductosService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ) { }

    async create(data: ProductoCreateDto): Promise<ProductoEntity> {
        const producto = this.productoRepository.create({
            ...data,
            categoria: { id: data.idCategoria } as any
        });
        return await this.productoRepository.save(producto);
    }

    //Devuelve productos con la categoria completa con todos sus campos
    async findAll(): Promise<ProductoEntity[]> {
        return this.productoRepository.find();
    }

    //Personalizamos la categoria para que solo devuelva id y name
    async findAll2(): Promise<any[]> {
        const productos = await this.productoRepository.find({ relations: ["categoria"] });
        return productos.map(producto => ({
            ...producto,
            categoria: producto.categoria
                ? { id: producto.categoria.id, name: producto.categoria.name }
                : null
        }));
    }

    async findOne(id: number): Promise<ProductoEntity> {
        const producto = await this.productoRepository.findOne({
            where: { id },
            relations: ["categoria"],
        });
        if (!producto) {
            throw new NotFoundException(`El producto con id ${id} no existe`);
        }
        return producto;
    }

    async update(id: number, data: ProductoUpdateDto): Promise<ProductoEntity> {
        let updateData: any = { ...data };
        if (data.idCategoria) {
            updateData.categoria = { id: data.idCategoria } as any;
            delete updateData.idCategoria;
        }
        await this.productoRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.productoRepository.delete(id);
    }
}
