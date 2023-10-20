import {BOARD_SIZE, Ship, ShipParameters, shipParameters, ShipPosition} from 'shared';
import {clone} from 'utils/clone';

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


export function checkCanPlaceShipWithOtherShips(p: ShipPosition, otherShips: Ship[]) {
    const field: boolean[][] = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));
    for (const ship of otherShips) {
        fillRange(ship.position, field);
    }
    return checkCanPlaceShip(p, field);
}

export function checkCanPlaceShip(p: ShipPosition, field: boolean[][]) {
    for (let i = p.start.row - 1; i <= p.end.row + 1; i++) {
        for (let j = p.start.col - 1; j <= p.end.col + 1; j++) {
            if ((0 <= i && i < BOARD_SIZE) && (0 <= j && i < BOARD_SIZE)) {
                if (field[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}

export function fillRange(p: ShipPosition, field: boolean[][]) {
    for (let i = p.start.row; i <= p.end.row; i++) {
        for (let j = p.start.col; j <= p.end.col; j++) {
            field[i][j] = true;
        }
    }
}
