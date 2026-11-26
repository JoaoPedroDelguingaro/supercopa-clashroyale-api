import { Deck } from "../../regras/deck";
import { Jogador } from "../jogador";

export class JogadorCompletoDto{
    id: number;
    nick: string;
    trofeus: number;
    deck: Deck;
    torneiosGanhos?: number; 

    static paraDto(jogador: Jogador): JogadorCompletoDto {
        const dto = new JogadorCompletoDto();
        dto.id = jogador.id;
        dto.nick = jogador.nick;
        dto.trofeus = jogador.trofeus;
        dto.deck = jogador.deck;
        dto.torneiosGanhos = jogador.torneiosGanhos;
        return dto;
  }
}

export class JogadorSimplesDto{
    nick: string;
    trofeus: number;
    deck: Deck;

    static paraDto(jogador: Jogador): JogadorSimplesDto {
        const dto = new JogadorSimplesDto();
        dto.nick = jogador.nick;
        dto.trofeus = jogador.trofeus;
        dto.deck = jogador.deck;
        return dto;
    }
}
