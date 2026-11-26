import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidaResultadoCompletoDto } from './dto/partida.dto';

@Controller('partidas')
export class PartidasController {
    constructor(private readonly service: PartidasService){}

    @Get()
    async listar(): Promise<PartidaResultadoCompletoDto[]>{
        return this.service.listar();
    }

    @Get('jogador/:id')
    async buscarPorJogador(@Param('id', ParseIntPipe) id: number): Promise<PartidaResultadoCompletoDto[]>{
        return this.service.buscarPartidaPorJogador(id);
    }

    @Get(':id')
    async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<PartidaResultadoCompletoDto>{
        return this.service.buscarPorId(id);
    }

    @Post('amistosa')
    async jogar(@Body('jogador1Id', ParseIntPipe) jogador1Id: number,
                @Body('jogador2Id', ParseIntPipe) jogador2Id: number): Promise<PartidaResultadoCompletoDto>{
        return this.service.jogarAmistosa(jogador1Id, jogador2Id);
    }
}
