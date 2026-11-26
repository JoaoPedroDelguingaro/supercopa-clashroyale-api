import { Deck } from "./deck";

type MATCH = {
    mtVantagem: Deck[]; vantagem: Deck[];
    desvantagem: Deck[]; mtDesvantagem: Deck[];
}

export function matchup(azul: Deck, vermelho: Deck): number {
    const deck = TABELA.get(azul);

    if (!deck) {
        return 0;
    }

    if (deck.mtVantagem.includes(vermelho)) {
        return 18;
    }

    if (deck.vantagem.includes(vermelho)) {
        return 10;
    }

    if (deck.desvantagem.includes(vermelho)) {
        return -10;
    }

    if (deck.mtDesvantagem.includes(vermelho)) {
        return -18;
    }

    return 0;
}

const TABELA = new Map<Deck, MATCH>([
    [Deck.PUSH, {
        mtVantagem: [Deck.CONSTRUCAO],
        vantagem: [Deck.CICLO, Deck.SPLASH_HARD],
        desvantagem: [Deck.FIRE_BAIT, Deck.BRIDGE_SPAM],
        mtDesvantagem: [Deck.LOG_BAIT, Deck.SPLIT_LANE],
    }],
    [Deck.CICLO, {
        mtVantagem: [Deck.BRIDGE_SPAM, Deck.HYPER_OFFENSE],
        vantagem: [Deck.SPLIT_LANE],
        desvantagem: [Deck.PUSH],
        mtDesvantagem: [Deck.CONSTRUCAO, Deck.SPLASH_HARD],
    }],
    [Deck.CONTROL, {
        mtVantagem: [Deck.LOG_BAIT, Deck.HYPER_OFFENSE],
        vantagem: [Deck.BRIDGE_SPAM],
        desvantagem: [Deck.FIRE_BAIT, Deck.SPLIT_LANE],
        mtDesvantagem: [Deck.CONSTRUCAO],
    }],
    [Deck.CONSTRUCAO, {
        mtVantagem: [Deck.CICLO, Deck.CONTROL],
        vantagem: [Deck.SPLASH_HARD],
        desvantagem: [Deck.FIRE_BAIT, Deck.BRIDGE_SPAM],
        mtDesvantagem: [Deck.PUSH, Deck.SPLIT_LANE],
    }],
    [Deck.LOG_BAIT, {
        mtVantagem: [Deck.PUSH],
        vantagem: [Deck.BRIDGE_SPAM],
        desvantagem: [Deck.FIRE_BAIT],
        mtDesvantagem: [Deck.CONTROL, Deck.SPLASH_HARD, Deck.SPLIT_LANE],
    }],
    [Deck.FIRE_BAIT, {
        mtVantagem: [],
        vantagem: [Deck.PUSH, Deck.CONTROL, Deck.CONSTRUCAO, Deck.LOG_BAIT],
        desvantagem: [Deck.BRIDGE_SPAM, Deck.HYPER_OFFENSE],
        mtDesvantagem: [Deck.SPLASH_HARD],
    }],
    [Deck.BRIDGE_SPAM, {
        mtVantagem: [],
        vantagem: [Deck.PUSH, Deck.CONSTRUCAO, Deck.FIRE_BAIT],
        desvantagem: [Deck.CONTROL, Deck.LOG_BAIT, Deck.SPLASH_HARD],
        mtDesvantagem: [Deck.CICLO],
    }],
    [Deck.SPLIT_LANE, {
        mtVantagem: [Deck.PUSH, Deck.CONSTRUCAO, Deck.LOG_BAIT],
        vantagem: [Deck.CONTROL],
        desvantagem: [Deck.CICLO, Deck.HYPER_OFFENSE],
        mtDesvantagem: [Deck.SPLASH_HARD],
    }],
    [Deck.SPLASH_HARD, {
        mtVantagem: [Deck.CICLO, Deck.LOG_BAIT, Deck.FIRE_BAIT, Deck.SPLIT_LANE],
        vantagem: [Deck.BRIDGE_SPAM],
        desvantagem: [Deck.PUSH, Deck.CONSTRUCAO],
        mtDesvantagem: [],
    }],
    [Deck.HYPER_OFFENSE, {
        mtVantagem: [],
        vantagem: [Deck.SPLIT_LANE, Deck.FIRE_BAIT],
        desvantagem: [],
        mtDesvantagem: [Deck.CICLO, Deck.CONTROL],
    }],
]);