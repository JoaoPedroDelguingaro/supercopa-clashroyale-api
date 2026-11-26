import { matchup } from "./matchups";
import { Deck } from "./deck";

const CHANCE_MINIMA = 20;
const CHANCE_MAXIMA = 80;

function limitar(valor: number): number {
    return Math.min(CHANCE_MAXIMA, Math.max(CHANCE_MINIMA, valor));
}

export function calcularProbabilidade(trofeus1: number, trofeus2: number, deck1: Deck, deck2: Deck): number {
    const baseTrofeus = limitar(50 + ((trofeus1 - trofeus2) / 1000) * 5);
    const chanceFinal = limitar(baseTrofeus + matchup(deck1, deck2));
    return Math.round(chanceFinal * 100) / 100;
}