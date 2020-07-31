import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import {status} from '../../share/entity-status.enum'

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true, length: 20 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  @JoinTable({ name: 'users_roles' })
  users: User[];

  @Column({ type: 'varchar', nullable: false, default: status.ACTIVE, length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
  updateAt: Date;
}
