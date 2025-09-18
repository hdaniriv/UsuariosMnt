import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { AppBaseEntity } from "./base.entity";
import { ProductoCategoriaEntity } from "./productoCategoria.entity";


@Entity("productos")
export class ProductoEntity extends AppBaseEntity {
  @Column({ unique: true, nullable: false })
  codigo!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 500 })
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: ['unidad', 'litro', 'par', 'libra'],
  })
  unidadMedida!: 'unidad' | 'litro' | 'par' | 'libra';

  @ManyToOne(() => ProductoCategoriaEntity, (categoria) => categoria.productos, { eager: true })
  @JoinColumn({ name: "idCategoria" })
  categoria!: ProductoCategoriaEntity;
}
