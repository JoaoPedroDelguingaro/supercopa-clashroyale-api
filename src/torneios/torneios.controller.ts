import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TorneiosService } from './torneios.service';
import { FaseResultadoDto, ResultadoTorneioDto, TorneioDto } from './dto/torneio.dto';

@Controller('torneios')
export class TorneiosController {
    constructor(private readonly service: TorneiosService){}

    @Get()
    async listar(): Promise<TorneioDto[]>{
        return this.service.listar();
    }

    @Get(':id')
    async buscar(@Param('id', ParseIntPipe) id: number): Promise<ResultadoTorneioDto> {
        return this.service.buscarResultadoTorneio(id);
    }

    @Post()
    async criar(@Body('titulo') titulo: string): Promise<TorneioDto> {
        return this.service.criar(titulo);
    }

    @Post(':id/inscrever')
    async inscrever(
        @Body('jogadorId', ParseIntPipe) jogadorId: number,
        @Param('id', ParseIntPipe) id: number): Promise<string> {
        return this.service.inscrever(id, jogadorId);
    }

    @Post(':id/sorteio')
    async sortear(@Param('id', ParseIntPipe) id: number): Promise<FaseResultadoDto> {
        return this.service.sortear(id);
    }

    @Post(':id/quartas')
    async jogarQuartas(@Param('id', ParseIntPipe) id: number): Promise<FaseResultadoDto> {
        return this.service.jogarQuartas(id);
    }

    @Post(':id/semifinal')
    async jogarSemi(@Param('id', ParseIntPipe) id: number): Promise<FaseResultadoDto> {
        return this.service.jogarSemifinal(id);
    }

    @Post(':id/final')
    async jogarFinal(@Param('id', ParseIntPipe) id: number): Promise<FaseResultadoDto> {
        return this.service.jogarFinal(id);
    }

}
