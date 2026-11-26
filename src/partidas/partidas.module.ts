import { Module } from '@nestjs/common';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from './partida';
import { JogadoresModule } from '../jogadores/jogadores.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partida]), JogadoresModule],
  controllers: [PartidasController],
  providers: [PartidasService],
  exports: [PartidasService]
})
export class PartidasModule {}
