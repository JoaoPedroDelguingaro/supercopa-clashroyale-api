import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AtualizaJogadorDto } from './dto/atualiza.jogador.dto';
import { CadastraJogadorDto } from './dto/cadastra.jogador.dto';
import { JogadorCompletoDto } from './dto/jogador.dto';
import { Jogador } from './jogador';
import { ehDeck } from '../regras/deck';
import { validarTextoObrigatorio, validarTrofeus } from '../regras/validacoes';

@Injectable()
export class JogadoresService {
    constructor(
        @InjectRepository(Jogador)
        private readonly repository: Repository<Jogador>)
    {}
    async registrarTitulo(id: number): Promise<void> {
        await this.repository.increment({ id }, 'torneiosGanhos', 1);
    }

    async alterarStatusTorneio(id: number, emTorneio: boolean): Promise<void> {
        await this.repository.update(id, { emTorneio });
    }

    private async validarNick(nick: string, ignorarId?: number): Promise<void> {
        const existente = await this.repository
        .createQueryBuilder('jogador')
        .where('LOWER(jogador.nick) = LOWER(:nick)', { nick })
        .getOne();

        if (existente && existente.id !== ignorarId) {
            throw new ConflictException(`O nick "${nick}" já está em uso!`);
        }
    }

    async buscarJogador(id: number): Promise<Jogador>{
        const jogador = await this.repository.findOneBy({id});

        if(!jogador){
            throw new NotFoundException(`Jogador do id:${id} não existe.`);
        }
        return jogador;
    }

    async listar(): Promise<JogadorCompletoDto[]>{
        const jogadores = await this.repository.find({
            order: { id: 'ASC' }
        });
        return jogadores.map((j) => JogadorCompletoDto.paraDto(j));
    } 

    async buscar(id: number): Promise<JogadorCompletoDto>{
        const jogador = await this.buscarJogador(id);
        return JogadorCompletoDto.paraDto(jogador);
    }

    async cadastrar(dto: CadastraJogadorDto): Promise<JogadorCompletoDto>{
        const nickLimpo = validarTextoObrigatorio(dto.nick, 'nick');
        
        if(!ehDeck(dto.deck)){
            throw new BadRequestException(`Deck inválido!`);
        }

        validarTrofeus(dto.trofeus);

        await this.validarNick(nickLimpo);
        
        const salvo = await this.repository.save({
            nick: nickLimpo,
            trofeus: dto.trofeus,
            deck: dto.deck,
        });
        
        return JogadorCompletoDto.paraDto(salvo);
    }

    async atualizar(id: number, dto: AtualizaJogadorDto): Promise<JogadorCompletoDto>{
        const jogador = await this.buscarJogador(id);
        
        if(jogador.emTorneio){
            throw new ConflictException(`Jogador do id:${id} está em torneio aguarde o encerramento!`)
        }

        if (dto.nick !== undefined) {
            const nickLimpo = validarTextoObrigatorio(dto.nick, 'nick');
            await this.validarNick(nickLimpo, id);
            jogador.nick = nickLimpo;
        }

        if (dto.trofeus !== undefined) {
            validarTrofeus(dto.trofeus);
            jogador.trofeus = dto.trofeus;
        }

        if (dto.deck !== undefined) {
            if (!ehDeck(dto.deck)) {
                throw new BadRequestException(`Deck inválido!`);
            }
            jogador.deck = dto.deck;
        }

        const salvo = await this.repository.save(jogador);
        return JogadorCompletoDto.paraDto(salvo);
    }    
}