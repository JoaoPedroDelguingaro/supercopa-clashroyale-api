import { Module } from '@nestjs/common';
import { PartidasModule } from './partidas/partidas.module';
import { TorneiosModule } from './torneios/torneios.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { opcoesBanco } from './banco';

@Module({
imports: [
    TypeOrmModule.forRoot(opcoesBanco), JogadoresModule, PartidasModule, TorneiosModule]
})
export class AppModule {}
