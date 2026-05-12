import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Destination } from './Destination';

@Entity('destinations_categories')
export class DestinationCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20 })
  name!: string;

  @ManyToMany(() => Destination, (destination) => destination.categories)
  destinations!: Destination[];
	nome: any;
}