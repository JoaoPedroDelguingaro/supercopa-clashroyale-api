import { Module } from '@nestjs/common';
import { TorneiosController } from './torneios.controller';
import { TorneiosService } from './torneios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneio } from './torneio';
import { JogadoresModule } from '../jogadores/jogadores.module';
import { PartidasModule } from '../partidas/partidas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Torneio]), JogadoresModule, PartidasModule],
  controllers: [TorneiosController],
  providers: [TorneiosService],
})
export class TorneiosModule {}
