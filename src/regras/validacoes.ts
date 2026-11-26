import { BadRequestException } from '@nestjs/common';

const TROFEUS_MIN = 0;
const TROFEUS_MAX = 14000;

export function validarTextoObrigatorio(valor: unknown, nomeCampo: string): string {
    if (typeof valor !== 'string' || !valor.trim()) {
        throw new BadRequestException(`O ${nomeCampo} é obrigatório!`);
    }
    return valor.trim();
}

export function validarTrofeus(trofeus: unknown): void {
    if (typeof trofeus !== 'number' ||
        !Number.isInteger(trofeus) ||
        trofeus < TROFEUS_MIN ||
        trofeus > TROFEUS_MAX) {
        throw new BadRequestException(`Os troféus devem ser um inteiro entre ${TROFEUS_MIN} e ${TROFEUS_MAX}`);
    }
}
