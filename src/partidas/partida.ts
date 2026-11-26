import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Fase } from "./fase";
import { Deck } from "../regras/deck";

@Entity('partidas')
export class Partida{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'int', nullable: true})
    torneioId: number | null;
    
    @Column()
    jogador1Id: number;

    @Column()
    jogador2Id: number;

    @Column({ type: 'enum', enum: Deck})
    deckJogador1: Deck;

    @Column({ type: 'enum', enum: Deck})
    deckJogador2: Deck; 

    @Column()
    trofeusJogador1: number;

    @Column()
    trofeusJogador2: number;

    @Column({ type: 'enum', enum: Fase})
    fase: Fase;

    @Column({ type: 'float'})
    probabilidadeJogador1: number;

    @Column({ type: 'int', nullable: true })
    vencedorId: number | null;
}