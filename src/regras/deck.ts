export enum Deck{
    PUSH = 'PUSH',
    CICLO = 'CICLO',
    CONTROL = 'CONTROL',
    CONSTRUCAO = 'CONSTRUCAO',
    LOG_BAIT = 'LOG_BAIT',
    FIRE_BAIT = 'FIRE_BAIT',
    BRIDGE_SPAM = 'BRIDGE_SPAM',
    SPLIT_LANE = 'SPLIT_LANE',
    SPLASH_HARD = 'SPLASH_HARD',
    HYPER_OFFENSE = 'HYPER_OFFENSE'    
}

export function ehDeck(valor: unknown): valor is Deck {
    return Object.values(Deck).includes(valor as Deck);
}