import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { DestinationCategory } from './DestinationCategory';
import { DestinationImage } from './DestinationImage';
import { Usuario } from './Usuario';
import { Review } from './Review';
import { AvailabilitySlot } from './AvailabilitySlot';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  slug!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text' })
  neighborhood!: string;

  @Column({ type: 'text' })
  city!: string;

  @Column({ type: 'text', default: 'RJ' })
  state!: string;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt!: Date;

  @OneToMany(() => DestinationImage, (image) => image.destination)
  images!: DestinationImage[];

  @ManyToMany(() => DestinationCategory, (category) => category.destinations)
  @JoinTable({
    name: 'destinations_categories_relation', 
    joinColumn: {
      name: 'destination_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'destination_category_id',
      referencedColumnName: 'id'
    }
  })
  categories!: DestinationCategory[];

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  createdBy!: Usuario;

  @OneToMany(() => Review, (review) => review.destination)
  reviews!: Review[];

  @OneToMany(() => AvailabilitySlot, (slot) => slot.destination)
  availabilitySlots!: AvailabilitySlot[];
}
