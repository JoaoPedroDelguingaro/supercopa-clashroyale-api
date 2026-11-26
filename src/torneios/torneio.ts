import { Jogador } from "../jogadores/jogador";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusTorneio } from "./status";

@Entity('torneios')
export class Torneio{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({unique: true})
    titulo: string;

    @Column({type: 'enum', enum: StatusTorneio, default: StatusTorneio.INSCRICOES})
    status: StatusTorneio;

    @Column({type: 'int', nullable: true})
    campeaoId: number | null;

    @JoinTable()
    @ManyToMany(()=> Jogador)
    inscritos: Jogador[];
}