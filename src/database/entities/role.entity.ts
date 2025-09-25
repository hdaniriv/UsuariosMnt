import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { UsuarioEntity } from './usuario.entity';

@Entity('roles')
export class RoleEntity extends AppBaseEntity {

    @Column({ unique: true, nullable: false })
    nombre!: string;

    @Column({ nullable: true })
    descripcion?: string;

    @Column({ default: true })
    activo!: boolean;

    @ManyToMany(() => UsuarioEntity, usuario => usuario.roles)
    usuarios!: UsuarioEntity[];
}