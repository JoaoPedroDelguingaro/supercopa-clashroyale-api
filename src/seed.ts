import 'dotenv/config';
import { DataSource } from 'typeorm';
import { opcoesBanco } from './banco';
import { Jogador } from './jogadores/jogador';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TorneiosService } from './torneios/torneios.service';
import { Deck } from './regras/deck';


async function seed() {
    const servidor = new DataSource({...opcoesBanco, database: 'postgres',});
    await servidor.initialize();
    await servidor.createQueryRunner().createDatabase(opcoesBanco.database!, true);
    await servidor.destroy();

    const app = await NestFactory.createApplicationContext(AppModule);
    const repositorio = app.get(DataSource).getRepository(Jogador);
    const torneiosService = app.get(TorneiosService);

    if ((await repositorio.count()) > 0) {
     console.log('O banco já tem dados');
        await app.close();
        return;
    }
    
    const jogadores = await repositorio.save([
        { nick: 'anny_157', trofeus: 11590, deck: Deck.PUSH },
        { nick: 'betim', trofeus: 7850, deck: Deck.CICLO },
        { nick: 'joaoBr', trofeus: 13570, deck: Deck.SPLIT_LANE },
        { nick: 'dieguinDuGrau', trofeus: 13200, deck: Deck.CONSTRUCAO },
        { nick: 'eva', trofeus: 14000, deck: Deck.LOG_BAIT },
        { nick: 'felipe006', trofeus: 6100, deck: Deck.FIRE_BAIT },
        { nick: 'gabizinha', trofeus: 5600, deck: Deck.BRIDGE_SPAM },
        { nick: 'goblin_maluco', trofeus: 1200, deck: Deck.SPLASH_HARD },
        { nick: 'irisaldo', trofeus: 10000, deck: Deck.CONTROL },
        { nick: 'carro_com_som', trofeus: 8300, deck: Deck.HYPER_OFFENSE },
    ]);
    console.log('10 jogadores cadastrados');

    const torneio = await torneiosService.criar('Supercopa 1º edição');
    for (let i = 0; i < 8; i++) {
        await torneiosService.inscrever(torneio.id, jogadores[i].id);
    }

    await torneiosService.sortear(torneio.id);
    await torneiosService.jogarQuartas(torneio.id);
    await torneiosService.jogarSemifinal(torneio.id);
    await torneiosService.jogarFinal(torneio.id);
    console.log('Torneio "Supercopa 1º edição" jogado até a final');

    await app.close();
}

seed();