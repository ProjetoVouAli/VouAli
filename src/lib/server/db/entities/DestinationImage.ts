import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Destination } from './Destination';

@Entity('destinations_images')
export class DestinationImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 200 })
  url!: string;

  @Column({ type: 'integer', name: 'destination_id' })
  destinationId!: number;

  @ManyToOne(() => Destination, (destination) => destination.images)
  @JoinColumn({ name: 'destination_id' })
  destination!: Destination;
}