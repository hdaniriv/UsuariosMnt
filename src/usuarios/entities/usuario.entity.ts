import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AppBaseEntity } from '../../common/entities/base.entity';


@Entity('usuarios')
export class UsuarioEntity extends AppBaseEntity {

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;
}