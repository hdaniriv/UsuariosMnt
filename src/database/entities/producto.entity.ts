import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { AppBaseEntity } from "./base.entity";

@Entity("productos")
export class ProductoEntity extends AppBaseEntity {
  @Column({ unique: true, nullable: false })
  codigo!: string;

  @Column({ nullable: false })
  name!: string;
}
