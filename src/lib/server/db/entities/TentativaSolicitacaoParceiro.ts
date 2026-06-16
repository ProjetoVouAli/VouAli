import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import 'reflect-metadata';

@Entity('tentativa_solicitacao_parceiro')
export class TentativaSolicitacaoParceiro {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column('varchar', { length: 45 })
    enderecoIP!: string;

    @Column('varchar', { length: 100, nullable: true })
    email?: string;

    @Column('varchar', { length: 18, nullable: true })
    cnpj?: string;

    @Column('boolean', { default: false })
    sucesso!: boolean;

    @Column('varchar', { length: 255, nullable: true })
    motivo?: string;

    @CreateDateColumn()
    dataTentativa!: Date;
}
