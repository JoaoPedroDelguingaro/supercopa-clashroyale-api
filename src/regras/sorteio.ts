import { Jogador } from "../jogadores/jogador";

export function embaralhar(jogadores: Jogador[]): Jogador[] {
    const lista = [...jogadores];

    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = lista[i];
        lista[i] = lista[j];
        lista[j] = temp;
    }

    return lista;
}