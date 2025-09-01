import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  title:{ uz: string; ru: string; en: string };

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => RestaurantEntity, (res) => res.organization)
  restaurants: RestaurantEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}