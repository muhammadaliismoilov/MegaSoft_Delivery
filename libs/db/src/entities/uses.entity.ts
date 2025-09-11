import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  fullName: string;
  @Column({ unique: true })
  phone: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
