import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import 'reflect-metadata';
import { Destination } from "./Destination";

export enum TipoUsuario {
    VIAJANTE = 'VIAJANTE',
    ADMINISTRADOR = 'ADMINISTRADOR',
    PARCEIRO = 'PARCEIRO'
}

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column('varchar', { length: 36, unique: true })
    uid!: string;

    @Column('varchar', { length: 40 })
    nome!: string;

    @Column('varchar', { length: 30, unique: true })
    email!: string;

    @Column('enum', { enum: ['M', 'F', 'O'] })
    sexo!: 'M' | 'F' | 'O';

    @CreateDateColumn()
    creationDate!: Date;

    @Column('boolean', { default: true })
    estaAutenticado!: boolean;

    @Column({
        type: 'enum',
        enum: TipoUsuario,
        array: true,
        default: [TipoUsuario.VIAJANTE]
    })
    papeis!: TipoUsuario[];


    @OneToMany(() => Destination, (destination) => destination.createdBy)
    destinations!: Destination[];
}