import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import 'reflect-metadata';

export enum StatusSolicitacao {
    PENDENTE = 'PENDENTE',
    APROVADA = 'APROVADA',
    REJEITADA = 'REJEITADA',
    REVISAO = 'REVISAO'
}

@Entity('solicitacao_parceiro')
export class SolicitacaoParceiro {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column('varchar', { length: 40 })
    nomeResponsavel!: string;

    @Column('varchar', { length: 100, unique: true })
    emailResponsavel!: string;

    @Column('varchar', { length: 20 })
    telefoneResponsavel!: string;

    @Column('varchar', { length: 100 })
    nomeEmpresa!: string;

    @Column('varchar', { length: 100, nullable: true })
    razaoSocial?: string;

    @Column('varchar', { length: 18, unique: true })
    cnpj!: string;

    @Column('varchar', { length: 50 })
    segmentoAtuacao!: string;

    @Column('text')
    descricaoNegocio!: string;

    @Column('varchar', { length: 100, nullable: true })
    website?: string;

    @Column('varchar', { length: 100, nullable: true })
    instagram?: string;

    @Column('varchar', { length: 20, nullable: true })
    whatsapp?: string;

    @Column('varchar', { length: 8 })
    cep!: string;

    @Column('varchar', { length: 100 })
    cidade!: string;

    @Column('varchar', { length: 2 })
    estado!: string;

    @Column('text', { nullable: true })
    endereco?: string;

    @Column({ type: 'text', nullable: true })
    street?: string;

    @Column({ type: 'text', nullable: true })
    number?: string;

    @Column({ type: 'text', nullable: true })
    complement?: string;

    @Column('boolean', { default: false })
    aceiteTermos!: boolean;

    @Column({
        type: 'enum',
        enum: StatusSolicitacao,
        default: StatusSolicitacao.PENDENTE
    })
    status!: StatusSolicitacao;

    @CreateDateColumn()
    dataSolicitacao!: Date;

    @Column({ type: 'timestamp', nullable: true })
    dataAprovaçao?: Date;

    @Column('text', { nullable: true })
    motivo?: string;

    @Column('varchar', { length: 30, unique: true, nullable: true })
    emailJaUsado?: string;
}
