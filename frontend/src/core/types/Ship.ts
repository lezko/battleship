import {clone} from 'utils/clone';

export interface Point {
    row: number;
    col: number;
}

export interface ShipPosition {
    start: Point;
    end: Point;
}

export interface Ship {
    size: number;
    position: ShipPosition;
    decksHit: number;
}

export type ShipParameters = { [key: number]: number; };

/**
 * Parameters of ships available in the game.
 * @key size of the ship (number of decks)
 * @value amount of ships of corresponding size
 */
export const shipParameters: ShipParameters = {
    1: 4, 2: 3, 3: 2, 4: 1
};

export const shipsTotal = Object.values(shipParameters).reduce((n, v) => {
    n += v;
    return n;
}, 0);

export function getSunkShipsCount(ships: Ship[]) {
    return ships.reduce((n, s) => {
        if (s.decksHit === s.size) {
            n++;
        }
        return n;
    }, 0);
}

export function getAliveShipsParams(ships: Ship[]): ShipParameters {
    const result: ShipParameters = {};
    for (const s of ships) {
        if (s.decksHit < s.size) {
            if (!(s.size in result)) {
                result[s.size] = 0;
            }
            result[s.size]++;
        }
    }
    return result;
}

export function getRemainingShipsParams(ships: Ship[]): ShipParameters {
    const result = clone(shipParameters);
    for (const ship of ships) {
        result[ship.size]--;
    }
    return result;
}