import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Destination } from "./Destination";
import { Usuario } from "./Usuario";

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column('int')
    rating!: number;

    @Column('text', { nullable: true })
    comment!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt!: Date;

    @ManyToOne(() => Destination, destination => destination.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'destination_id' })
    destination!: Destination;

    @ManyToOne(() => Usuario, usuario => usuario.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario!: Usuario;
    review!: import("../../../../hooks.server").AuthUser;
}
