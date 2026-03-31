import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

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

    @Column('varchar', { length: 255 })
    senha!: string;

    @Column('enum', { enum: ['M', 'F', 'O'] })
    sexo!: 'M' | 'F' | 'O';

    @CreateDateColumn()
    creationDate!: Date;

    @Column('boolean', { default: true })
    estaAutenticado!: boolean;

    @Column('boolean', { default: true })
    eViajante!: boolean;

    @Column('boolean', { default: false })
    eAdministrador!: boolean;

    @Column('boolean', { default: false })
    eParceiro!: boolean;
}