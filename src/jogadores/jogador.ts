import { Deck } from "../regras/deck";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('jogadores')
export class Jogador{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({unique: true})
    nick: string;

    @Column({type: 'enum', enum: Deck})
    deck: Deck;

    @Column()
    trofeus: number;

    @Column({default: 0})
    torneiosGanhos: number; 

    @Column({default: false})
    emTorneio: boolean;

}