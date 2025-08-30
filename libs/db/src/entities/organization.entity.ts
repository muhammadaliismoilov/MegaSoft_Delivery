import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from 'typeorm';
import { PriceEntity } from './prices.entity';
import { WeighEntity } from './weighs.entity';
import { RestaurantEntity } from './restaurant.entity';

@Entity('products')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => RestaurantEntity, (res) => res.organization)
  restaurants: RestaurantEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}