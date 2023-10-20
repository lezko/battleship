import {Point, Ship, shipParameters, ShipPosition, BOARD_SIZE, rand} from 'shared';
import {checkCanPlaceShip, fillRange} from 'utils/shipUtils';

const RANDOM_POSITION_ATTEMPT_THRESHOLD = 50;

const shipSizes: number[] = [];
for (const size of Object.keys(shipParameters).map(Number)) {
    for (let i = 0; i < shipParameters[size]; i++) {
        shipSizes.push(size);
    }
    shipSizes.sort((a, b) => b - a);
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

            const point: Point = {row: rand(0, BOARD_SIZE), col: rand(0, BOARD_SIZE)};
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