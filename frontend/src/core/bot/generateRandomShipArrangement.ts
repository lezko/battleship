import {Point, Ship, shipParameters, ShipPosition} from 'core/types/Ship';
import {BOARD_SIZE} from 'core/types/Board';
import {random} from 'core/bot/random';

const RANDOM_POSITION_ATTEMPT_THRESHOLD = 50;

const shipSizes: number[] = [];
for (const size of Object.keys(shipParameters).map(Number)) {
    for (let i = 0; i < shipParameters[size]; i++) {
        shipSizes.push(size);
    }
    shipSizes.sort((a, b) => b - a);
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

export function generateRandomShipArrangement(): Ship[] {
    const field: boolean[][] = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));

    function tryPlaceShip(shipSize: number, p: Point): Ship | null {
        if (field[p.row][p.col]) {
            return null;
        }
        const probablePoints: Point[] = [
            // top
            {row: p.row - (shipSize - 1), col: p.col},
            // right
            {row: p.row, col: p.col + (shipSize - 1)},
            // bottom
            {row: p.row + (shipSize - 1), col: p.col},
            // left
            {row: p.row, col: p.col - (shipSize - 1)}
        ];
        for (const probablePoint of probablePoints) {
            if (
                !(0 <= probablePoint.row && probablePoint.row < BOARD_SIZE) ||
                !(0 <= probablePoint.col && probablePoint.col < BOARD_SIZE)
            ) {
                continue;
            }

            const shipPosition = normalizeShipPosition({start: p, end: probablePoint});
            if (checkCanPlaceShip(shipPosition, field)) {
                fillRange(shipPosition, field);
                return {
                    size: shipSize,
                    decksHit: 0,
                    position: shipPosition
                };
            }
        }
        return null;
    }

    const ships: Ship[] = [];
    for (const s of shipSizes) {
        let c = 0;
        while (true) {
            c++;
            let shipPlaced = false;
            if (c > RANDOM_POSITION_ATTEMPT_THRESHOLD) {
                for (let i = 0; i < BOARD_SIZE; i++) {
                    for (let j = 0; j < BOARD_SIZE; j++) {
                        const ship = tryPlaceShip(s, {row: i, col: j});
                        if (ship !== null) {
                            ships.push(ship);
                            shipPlaced = true;
                            break;
                        }
                    }
                    if (shipPlaced) {
                        break;
                    }
                }
            }
            if (shipPlaced) {
                break;
            }

            const point: Point = {row: random(0, BOARD_SIZE), col: random(0, BOARD_SIZE)};
            const ship = tryPlaceShip(s, point);
            if (ship !== null) {
                ships.push(ship);
                break;
            }
        }
    }

    return ships;
}

export function normalizeShipPosition(position: ShipPosition): ShipPosition {
    const p1 = position.start;
    const p2 = position.end;
    if (p1.row > p2.row) {
        const t = p1.row;
        p1.row = p2.row;
        p2.row = t;
    }
    if (p1.col > p2.col) {
        const t = p1.col;
        p1.col = p2.col;
        p2.col = t;
    }
    return {start: p1, end: p2};
}