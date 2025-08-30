import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
  } from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity('products')
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.restaurants)
  organization:OrganizationEntity;

  @Column()
  description:string;

  @Column()
  addreses: string;

  @Column('float')
  lat: number;

  @Column('float')
  long: number;

  @Column()
  freeDelivery: boolean;

  @Column()
  isOpen: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}