import {IPoint, IShip, IShipPosition} from 'core/types/IShip';
import {BOARD_SIZE} from 'core/types/IBoard';
import {random} from 'core/bot/random';

/**
 * Parameters of ships available in the game.
 * @key size of the ship (number of decks)
 * @value amount of ships of corresponding size
 */
const shipParameters: { [key: number]: number } = {
    1: 4, 2: 3, 3: 2, 4: 1
};

const shipSizes: number[] = [];
for (const size of Object.keys(shipParameters).map(Number)) {
    for (let i = 0; i < shipParameters[size]; i++) {
        shipSizes.push(size);
    }
    shipSizes.sort((a, b) => b - a);
}

// todo limit max number of random position attempts
export function generateRandomShipArrangement(): IShip[] {
    const field: boolean[][] = Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(false));

    function fillRange(p: IShipPosition) {
        for (let i = p.start.row; i <= p.end.row; i++) {
            for (let j = p.start.col; j <= p.end.col; j++) {
                field[i][j] = true;
            }
        }
    }

    function checkCanPlaceShip(p: IShipPosition) {
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

    const ships: IShip[] = [];
    for (const s of shipSizes) {
        while (true) {
            const point: IPoint = {row: random(0, BOARD_SIZE), col: random(0, BOARD_SIZE)};
            if (field[point.row][point.col]) {
                continue;
            }
            const probablePoints: IPoint[] = [
                // top
                {row: point.row - (s - 1), col: point.col},
                // right
                {row: point.row, col: point.col + (s - 1)},
                // bottom
                {row: point.row + (s - 1), col: point.col},
                // left
                {row: point.row, col: point.col - (s - 1)}
            ];
            let shipPlaced = false;
            for (const probablePoint of probablePoints) {
                if (
                    !(0 <= probablePoint.row && probablePoint.row < BOARD_SIZE) ||
                    !(0 <= probablePoint.col && probablePoint.col < BOARD_SIZE)
                ) {
                    continue;
                }

                const shipPosition = normalizeShipPosition({start: point, end: probablePoint});
                if (checkCanPlaceShip(shipPosition)) {
                    fillRange(shipPosition);
                    shipPlaced = true;
                    ships.push({
                        size: s,
                        decksHit: 0,
                        position: shipPosition
                    });
                    break;
                }
            }
            if (shipPlaced) {
                break;
            }
        }
    }

    return ships;
}

function normalizeShipPosition(position: IShipPosition): IShipPosition {
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