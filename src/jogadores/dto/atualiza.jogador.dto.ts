import { Deck } from "../../regras/deck";

export class AtualizaJogadorDto{
    nick?: string;
    trofeus?: number;
    deck?: Deck;
}