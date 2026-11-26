import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jogador } from '../jogadores/jogador';
import { JogadoresService } from '../jogadores/jogadores.service';
import { Repository } from 'typeorm';
import { PartidaResultadoCompletoDto, PartidaResultadoSimplesDto } from './dto/partida.dto';
import { Fase } from './fase';
import { Partida } from './partida';
import { calcularProbabilidade } from '../regras/probabilidade';

@Injectable()
export class PartidasService {
    constructor(
        @InjectRepository(Partida)
        private readonly repository: Repository<Partida>,
        private readonly jogadoresService: JogadoresService,
    )
    {}

    private async paraDto(partida: Partida): Promise<PartidaResultadoCompletoDto> {
        const dto = new PartidaResultadoCompletoDto();
        const jogador1 = await this.jogadoresService.buscarJogador(partida.jogador1Id);
        const jogador2 = await this.jogadoresService.buscarJogador(partida.jogador2Id);
        dto.id = partida.id;
        dto.fase = partida.fase;

        dto.jogador1 = {nick: jogador1.nick, deck: partida.deckJogador1, trofeus: partida.trofeusJogador1};
        dto.jogador2 = {nick: jogador2.nick, deck: partida.deckJogador2, trofeus: partida.trofeusJogador2};

        const prob2 = Math.round((100 - partida.probabilidadeJogador1) * 100) / 100;

        dto.probabilidadeJogador1 = `${partida.probabilidadeJogador1.toFixed(2)}%`;
        dto.probabilidadeJogador2 = `${prob2.toFixed(2)}%`;
    
        if (partida.vencedorId) {
            if (partida.vencedorId === partida.jogador1Id){
                dto.vencedor = dto.jogador1;
            } else {
                dto.vencedor = dto.jogador2;
            }
        }
        
        return dto;
    }

    async paraDtoSimples(partida: Partida): Promise<PartidaResultadoSimplesDto> {
        const { id, fase, ...simples } = await this.paraDto(partida);
        return simples;
    }

    async criarPartida(torneioId: number | null, fase: Fase, jogador1: Jogador, jogador2: Jogador): Promise<Partida> {
        return this.repository.save({
            torneioId,
            fase,
            jogador1Id: jogador1.id,
            deckJogador1: jogador1.deck,
            trofeusJogador1: jogador1.trofeus,

            jogador2Id: jogador2.id,
            deckJogador2: jogador2.deck,
            trofeusJogador2: jogador2.trofeus,
            
            probabilidadeJogador1: calcularProbabilidade(jogador1.trofeus, jogador2.trofeus, jogador1.deck, jogador2.deck),
            vencedorId: null,
        });
    }

    async jogarPartida(partida: Partida): Promise<Partida> {
        if (partida.vencedorId !== null) {
            throw new ConflictException('Esta partida já foi jogada');
        }
        const jogador1Vence = Math.random() * 100 < partida.probabilidadeJogador1;

        if (jogador1Vence) {
            partida.vencedorId = partida.jogador1Id;
        } else {
            partida.vencedorId = partida.jogador2Id;
        }

        return this.repository.save(partida);
    }

    async buscarPartidaPorTorneioEFase(torneioId: number, fase: Fase): Promise<Partida[]> {
        return this.repository.find({
            where: { torneioId , fase},
            order: { id: 'ASC' },
        });
    }

    async buscarPartidaPorTorneio(torneioId: number): Promise<Partida[]> {
        return this.repository.find({
            where: { torneioId },
            order: { id: 'ASC' },
        });
    }

    async listar(): Promise<PartidaResultadoCompletoDto[]>{
        const partidas = await this.repository.find({
            order: { id: 'ASC' },
        });
        return Promise.all(partidas.map((p) => this.paraDto(p)));
    }

    async buscarPartidaPorJogador(id: number): Promise<PartidaResultadoCompletoDto[]>{
        await this.jogadoresService.buscarJogador(id);
        const partidas = await this.repository.find({
            where: [{ jogador1Id: id }, { jogador2Id: id }],
            order: { id: 'ASC' }
        });
        return Promise.all(partidas.map((p) => this.paraDto(p)));
    }

    async buscarPorId(id: number): Promise<PartidaResultadoCompletoDto>{
        const partida = await this.repository.findOneBy({ id });

        if (!partida){
            throw new NotFoundException(`Partida ${id} não existe`);
        }
        return this.paraDto(partida);
    }

    async jogarAmistosa(jogador1Id: number, jogador2Id: number): Promise<PartidaResultadoCompletoDto>{
        if (jogador1Id === jogador2Id) {
            throw new BadRequestException('Os jogadores devem ser diferentes');
        }

        const jogador1 = await this.jogadoresService.buscarJogador(jogador1Id);
        const jogador2 = await this.jogadoresService.buscarJogador(jogador2Id);

        const partida = await this.criarPartida(null, Fase.AMISTOSA, jogador1, jogador2);
        const jogada = await this.jogarPartida(partida);

        return this.paraDto(jogada);
    }
}