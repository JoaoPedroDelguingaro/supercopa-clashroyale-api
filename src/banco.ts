import { PostgresConnectionOptions }
    from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Torneio } from './torneios/torneio';
import { Partida } from './partidas/partida';
import { Jogador } from './jogadores/jogador';
import process from 'process';

export const opcoesBanco: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    entities: [Torneio, Partida, Jogador],
    synchronize: true,
};
