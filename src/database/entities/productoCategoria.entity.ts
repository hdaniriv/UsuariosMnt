import { Entity, Column,OneToMany } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { ProductoEntity } from "./producto.entity";

@Entity("productosCategorias")
export class ProductoCategoriaEntity extends AppBaseEntity {
    @Column({unique: true, type: 'varchar', length: 50 })
    name!: string;

     @OneToMany(() => ProductoEntity, (producto) => producto.categoria)
    productos!: ProductoEntity[];
}
