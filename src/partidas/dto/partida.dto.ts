import { JogadorSimplesDto } from "../../jogadores/dto/jogador.dto";
import { Fase } from "../fase";

export class PartidaResultadoCompletoDto {
    id: number;
    fase: Fase;
    jogador1: JogadorSimplesDto;
    jogador2: JogadorSimplesDto;
    probabilidadeJogador1: string;
    probabilidadeJogador2: string;
    vencedor: JogadorSimplesDto;
}

export class PartidaResultadoSimplesDto {
    jogador1: JogadorSimplesDto;
    jogador2: JogadorSimplesDto;
    probabilidadeJogador1: string;
    probabilidadeJogador2: string;
    vencedor?: JogadorSimplesDto;
}

