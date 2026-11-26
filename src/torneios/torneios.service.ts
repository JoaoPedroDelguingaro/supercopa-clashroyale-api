import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { embaralhar } from '../regras/sorteio';
import { validarTextoObrigatorio } from '../regras/validacoes';
import { Repository } from 'typeorm';
import { JogadorSimplesDto } from '../jogadores/dto/jogador.dto';
import { JogadoresService } from '../jogadores/jogadores.service';
import { Fase } from '../partidas/fase';
import { Partida } from '../partidas/partida';
import { PartidasService } from '../partidas/partidas.service';
import { FaseResultadoDto, ResultadoTorneioDto, TorneioDto } from './dto/torneio.dto';
import { StatusTorneio } from './status';
import { Torneio } from './torneio';

@Injectable()
export class TorneiosService {
    constructor(
        @InjectRepository(Torneio)
        private readonly repository: Repository<Torneio>,
        private readonly jogadorService: JogadoresService,
        private readonly partidasService: PartidasService
    )
    {}

    private async montarFase(fase: Fase, partidas: Partida[]): Promise<FaseResultadoDto> {
        const dto = await Promise.all(partidas
            .map((p) => this.partidasService.paraDtoSimples(p)));

        return {fase, partidas: dto};
    }

    private async montaTorneio(torneio: Torneio): Promise<ResultadoTorneioDto> {
        const partidas = await this.partidasService.buscarPartidaPorTorneio(torneio.id);
        const ordemFases = [Fase.QUARTAS, Fase.SEMIFINAL, Fase.FINAL];
        const fases: FaseResultadoDto[] = [];

        for (const fase of ordemFases) {
            const daFase = partidas.filter((p) => p.fase === fase);
            if (daFase.length > 0) {
                fases.push(await this.montarFase(fase, daFase));
            }
        }

        let campeao: JogadorSimplesDto | undefined;
        if (torneio.campeaoId) {
            const jogadorCampeao = torneio.inscritos.find((j) => j.id === torneio.campeaoId);
            if (jogadorCampeao) {
                campeao = {
                    nick: jogadorCampeao.nick,
                    deck: jogadorCampeao.deck,
                    trofeus: jogadorCampeao.trofeus,
                };
            }
        }

        return {torneioId: torneio.id, campeao, fases};
    }

    private async buscarTorneio(id: number): Promise<Torneio>{
        const torneio = await this.repository.findOne({
            where: { id },
            relations: ['inscritos']
        });

        if(!torneio){
            throw new NotFoundException(`Torneio do id:${id} não existe.`)
        }
        return torneio;
    }

    private async validarTitulo(titulo: string): Promise<void> {
        const existente = await this.repository
        .createQueryBuilder('torneio')
        .where('LOWER(torneio.titulo) = LOWER(:titulo)', { titulo })
        .getOne();
        
        if (existente) {
            throw new ConflictException(`O Titulo: "${titulo}" já está em uso!`);
        }
    }

    async listar(): Promise<TorneioDto[]> {
        const torneios = await this.repository.find({
            order: { id: 'ASC' },
        });

        return torneios.map((t) => TorneioDto.paraDto(t));
    }

    async buscarResultadoTorneio(id: number): Promise<ResultadoTorneioDto>{
        const torneio = await this.buscarTorneio(id);
        return await this.montaTorneio(torneio);
    }

    async criar(titulo: string): Promise<TorneioDto>{
        const tituloLimpo = validarTextoObrigatorio(titulo, 'titulo');
        await this.validarTitulo(tituloLimpo);

        const salvo = await this.repository.save({titulo: tituloLimpo});
        return TorneioDto.paraDto(salvo);
    }

    async inscrever(idTorneio: number, idJogador: number): Promise<string>{
        const torneio = await this.buscarTorneio(idTorneio);

        if (torneio.status !== StatusTorneio.INSCRICOES) {
            throw new ConflictException(`O torneio "${torneio.titulo}" não está aberto para inscrições.`);
        }

        if(torneio.inscritos.length >= 8){
            throw new ConflictException(`O torneio ${torneio.titulo} está lotado.`);
        }

        const jogador = await this.jogadorService.buscarJogador(idJogador);
        
        if(jogador.emTorneio){
            throw new ConflictException(`O jogador ${jogador.nick} já está inscrito em um torneio.`);
        }
        
        torneio.inscritos.push(jogador);
        await this.repository.save(torneio);
        await this.jogadorService.alterarStatusTorneio(jogador.id, true);

        return `${jogador.nick} inscrito com sucesso no torneio "${torneio.titulo}" (${torneio.inscritos.length}/8).`;
    }

    async sortear(id: number): Promise<FaseResultadoDto>{
        const torneio = await this.buscarTorneio(id);

        if(torneio.status !== StatusTorneio.INSCRICOES){
            throw new ConflictException
            (`Não é possível realizar o sorteio. Status atual do torneio: ${torneio.status} (esperado: ${StatusTorneio.INSCRICOES})`);
        }

        if(torneio.inscritos.length < 8){
            throw new ConflictException
            (`O torneio precisa de 8 inscritos para realizar o sorteio atualmente:(${torneio.inscritos.length}/8).`);
        }

        const embaralhados = embaralhar(torneio.inscritos);
        const partidasCriadas: Partida[] = []; 
        
        for (let i = 0; i < embaralhados.length; i += 2){
            const partida = await this.partidasService.criarPartida(torneio.id, Fase.QUARTAS, 
                embaralhados[i], embaralhados [i + 1]);
            partidasCriadas.push(partida);

        }
        await this.repository.update(torneio.id, {status : StatusTorneio.SORTEADO});
        
        return this.montarFase(Fase.QUARTAS, partidasCriadas);
    }

    async jogarQuartas(id: number): Promise<FaseResultadoDto>{
        const torneio = await this.buscarTorneio(id);

        if(torneio.status !== StatusTorneio.SORTEADO){
            throw new ConflictException
            (`Não é possível jogar as quartas. Status atual do torneio: ${torneio.status} (esperado: ${StatusTorneio.SORTEADO}).`);
        }
        const partidas = await this.partidasService.buscarPartidaPorTorneioEFase(torneio.id, Fase.QUARTAS);

        const partidasJogadas = await Promise.all(partidas.map((p) => this.partidasService.jogarPartida(p)));

        const vencedoresIds: number[] = [];
        const perdedoresIds: number[] = [];

        for(const p of partidasJogadas){
            if(p.vencedorId === p.jogador1Id){
                vencedoresIds.push(p.jogador1Id);
                perdedoresIds.push(p.jogador2Id)
            } else {
                vencedoresIds.push(p.jogador2Id);
                perdedoresIds.push(p.jogador1Id);
            }
        }

        await Promise.all(perdedoresIds.map((p) => this.jogadorService.alterarStatusTorneio(p, false)));

        const vencedores = await Promise.all(vencedoresIds.map((v) => this.jogadorService.buscarJogador(v)));

        for(let i = 0; i < vencedores.length; i += 2) {
            await this.partidasService.criarPartida(torneio.id, Fase.SEMIFINAL, vencedores[i], vencedores[i + 1]);
        }

        await this.repository.update(torneio.id, {status: StatusTorneio.QUARTAS_JOGADAS});

        return this.montarFase(Fase.QUARTAS, partidasJogadas);

    }

    async jogarSemifinal(id: number): Promise<FaseResultadoDto>{
        const torneio = await this.buscarTorneio(id);

        if(torneio.status !== StatusTorneio.QUARTAS_JOGADAS){
            throw new ConflictException
            (`Não é possível jogar as Semi finais. Status atual do torneio: ${torneio.status} (esperado: ${StatusTorneio.QUARTAS_JOGADAS}).`);
        }
        const partidas = await this.partidasService.buscarPartidaPorTorneioEFase(torneio.id, Fase.SEMIFINAL);

        const partidasJogadas = await Promise.all(partidas.map((p) => this.partidasService.jogarPartida(p)));

        const vencedoresIds: number[] = [];
        const perdedoresIds: number[] = [];

        for(const p of partidasJogadas){
            if(p.vencedorId === p.jogador1Id){
                vencedoresIds.push(p.jogador1Id);
                perdedoresIds.push(p.jogador2Id)
            } else {
                vencedoresIds.push(p.jogador2Id);
                perdedoresIds.push(p.jogador1Id);
            }
        }

        await Promise.all(perdedoresIds.map((p) => this.jogadorService.alterarStatusTorneio(p, false)));

        const vencedores = await Promise.all(vencedoresIds.map((v) => this.jogadorService.buscarJogador(v)));

        await this.partidasService.criarPartida(torneio.id, Fase.FINAL, vencedores[0], vencedores[1]);
        
        await this.repository.update(torneio.id, {status: StatusTorneio.SEMIFINAL_JOGADA});

        return this.montarFase(Fase.SEMIFINAL, partidasJogadas);

    }

    async jogarFinal(id: number): Promise<FaseResultadoDto>{
        const torneio = await this.buscarTorneio(id);

        if(torneio.status !== StatusTorneio.SEMIFINAL_JOGADA){
            throw new ConflictException
            (`Não é possível jogar a Final. Status atual do torneio: ${torneio.status} (esperado: ${StatusTorneio.SEMIFINAL_JOGADA}).`);
        }
        const partida = await this.partidasService.buscarPartidaPorTorneioEFase(torneio.id, Fase.FINAL);

        const partidasJogada = await this.partidasService.jogarPartida(partida[0]);

        const campeaoId = partidasJogada.vencedorId!;

        await this.jogadorService.alterarStatusTorneio(partidasJogada.jogador1Id, false);
        await this.jogadorService.alterarStatusTorneio(partidasJogada.jogador2Id, false);
        await this.jogadorService.registrarTitulo(campeaoId);
        
        await this.repository.update(torneio.id, {status: StatusTorneio.ENCERRADO, campeaoId});
    
        return this.montarFase(Fase.FINAL, [partidasJogada]);

    }
}
