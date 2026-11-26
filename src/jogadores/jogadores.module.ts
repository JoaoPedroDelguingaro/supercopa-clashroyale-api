import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { JogadoresService } from './jogadores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jogador } from './jogador';

@Module({
  imports: [TypeOrmModule.forFeature([Jogador])],
  controllers: [JogadoresController],
  providers: [JogadoresService],
  exports: [JogadoresService]
})
export class JogadoresModule {
  
}
