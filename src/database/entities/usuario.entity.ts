import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { RoleEntity } from './role.entity';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity('usuarios')
export class UsuarioEntity extends AppBaseEntity {

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  @Exclude() // Excluir password de respuestas JSON
  password!: string;

  @Column({ default: true })
  activo!: boolean;

  @Column({ type: 'datetime', nullable: true })
  ultimoLogin?: Date;

  @ManyToMany(() => RoleEntity, role => role.usuarios, { cascade: true, eager: true })
  @JoinTable({
    name: 'usuario_roles',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles!: RoleEntity[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  hasRole(roleName: string): boolean {
    return this.roles.some(role => role.nombre === roleName);
  }

  getRoleNames(): string[] {
    return this.roles.map(role => role.nombre);
  }
}