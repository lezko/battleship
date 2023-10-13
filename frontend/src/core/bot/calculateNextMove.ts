import {BOARD_SIZE, IBoard} from 'core/types/IBoard';
import {IPoint} from 'core/types/IShip';
import {CellState} from 'core/types/CellState';
import {random} from 'core/bot/random';

function checkHitPossible(board: IBoard, p: IPoint, allowedPoint: IPoint) {
    for (let i = p.row - 1; i <= p.row + 1; i++) {
        for (let j = p.col - 1; j <= p.col + 1; j++) {
            if ((0 <= i && i < BOARD_SIZE) && (0 <= j && i < BOARD_SIZE)) {
                if (
                    (board[i][j] !== CellState.Default && board[i][j] !== CellState.Miss) &&
                    (i !== allowedPoint.row || j !== allowedPoint.col)
                ) {
                    return false;
                }
            }
        }
    }
    return board[p.row][p.col] === CellState.Default;
}

export function calculateNextMove(board: IBoard): IPoint {
    // checking rows
    for (let i = 0; i < BOARD_SIZE; i++) {
        let l = 0;
        let sunk = false;
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === CellState.Hit) {
                l++;
            }
            if (board[i][j] === CellState.Sunk) {
                sunk = true;
                l++;
            }
            if ((board[i][j] !== CellState.Hit && board[i][j] !== CellState.Sunk) || (j === BOARD_SIZE - 1)) {
                if (l > 0 && !sunk) {
                    const start = j - l - (j === BOARD_SIZE - 1 ? 0 : 1);
                    const leftPoint: IPoint = {row: i, col: start};
                    if (start >= 0 && checkHitPossible(board, leftPoint, {row: i, col: start + 1})) {
                        return leftPoint;
                    }
                    const rightPoint: IPoint = {row: i, col: j};
                    if (j < BOARD_SIZE - 1 && checkHitPossible(board, rightPoint, {row: j, col: j - 1})) {
                        return rightPoint;
                    }
                }
                l = 0;
                sunk = false;
            }
        }
    }

    // checking columns
    for (let j = 0; j < BOARD_SIZE; j++) {
        let l = 0;
        let sunk = false;
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (board[i][j] === CellState.Hit) {
                l++;
            }
            if (board[i][j] === CellState.Sunk) {
                sunk = true;
                l++;
            }
            if ((board[i][j] !== CellState.Hit && board[i][j] !== CellState.Sunk) || (i === BOARD_SIZE - 1)) {
                if (l > 0 && !sunk) {
                    const start = i - l - (i === BOARD_SIZE - 1 ? 0 : 1);
                    const topPoint: IPoint = {row: start, col: j};
                    if (start >= 0 && checkHitPossible(board, topPoint, {row: start + 1, col: j})) {
                        return topPoint;
                    }
                    const bottomPoint: IPoint = {row: i, col: j};
                    if (i < BOARD_SIZE - 1 && checkHitPossible(board, bottomPoint, {row: i - 1, col: j})) {
                        return bottomPoint;
                    }
                }
                l = 0;
                sunk = false;
            }
        }
    }

    while (true) {
        const randomPos = {row: random(0, BOARD_SIZE), col: random(0, BOARD_SIZE)};
        if (board[randomPos.row][randomPos.col] === CellState.Default) {
            return randomPos;
        }
    }
}