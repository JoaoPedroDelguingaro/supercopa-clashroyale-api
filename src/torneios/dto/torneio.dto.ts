import { JogadorSimplesDto } from "../../jogadores/dto/jogador.dto";
import { PartidaResultadoSimplesDto } from "../../partidas/dto/partida.dto";
import { Fase } from "../../partidas/fase";
import { StatusTorneio } from "../status";
import { Torneio } from "../torneio";

export class TorneioDto{
    id: number;
    titulo: string;
    status: StatusTorneio;

    static paraDto(torneio: Torneio):TorneioDto {
        return{
        id: torneio.id,
        titulo: torneio.titulo,
        status: torneio.status
        };
    }
}

export class FaseResultadoDto {
    fase: Fase;
    partidas: PartidaResultadoSimplesDto[];
}

export class ResultadoTorneioDto {
    torneioId: number;
    campeao?: JogadorSimplesDto;
    fases: FaseResultadoDto[];
}