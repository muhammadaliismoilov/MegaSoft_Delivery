import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Unique,
  } from 'typeorm'
import { ProductEntity } from './product.entity';

@Entity('weighs')
@Unique('unique_product_weigh', ['product', 'weigh'])
export class WeighEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductEntity, (product) => product.weighs, { onDelete: 'CASCADE' })
  product: ProductEntity;

  @Column({ type: 'float' })
  weigh: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}