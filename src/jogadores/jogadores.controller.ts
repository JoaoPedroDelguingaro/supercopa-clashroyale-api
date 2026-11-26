import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import { JogadoresService } from './jogadores.service';
import { CadastraJogadorDto } from './dto/cadastra.jogador.dto';
import { AtualizaJogadorDto } from './dto/atualiza.jogador.dto';
import { JogadorCompletoDto } from './dto/jogador.dto';

@Controller('jogadores')
export class JogadoresController {
    constructor(private readonly service: JogadoresService){}

    @Get()
    async listar(): Promise<JogadorCompletoDto[]>{
        return this.service.listar();
    }

    @Get(':id')
    async buscar(@Param('id', ParseIntPipe) id: number): Promise<JogadorCompletoDto>{
        return this.service.buscar(id)
    }

    @Post()
    async cadastrar(@Body() dto: CadastraJogadorDto): Promise<JogadorCompletoDto>{
        return this.service.cadastrar(dto);
    }

    @Patch('atualizar/:id')
    async atualizar(@Body() dto: AtualizaJogadorDto, @Param('id', ParseIntPipe) id: number): Promise<JogadorCompletoDto>{
        return this.service.atualizar(id, dto);
    }
}
