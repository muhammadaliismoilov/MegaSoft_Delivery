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

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => PriceEntity, (price) => price.product)
  prices: PriceEntity[];

  @OneToMany(() => WeighEntity, (weigh) => weigh.product)
  weighs: WeighEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}