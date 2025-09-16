import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('food_types')
export class FoodTypesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  title:{ uz: string; ru: string; en: string };

  @Column({ type: 'int', nullable: false })
  sequence: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({type:'boolean',default:true})
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({  name: 'updated_at' })
  updated_at: Date;
}
