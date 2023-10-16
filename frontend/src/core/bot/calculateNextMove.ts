import {BOARD_SIZE, Board} from 'core/types/Board';
import {Point} from 'core/types/Ship';
import {CellState} from 'core/types/CellState';
import {random} from 'core/bot/random';

const RANDOM_POSITION_ATTEMPT_THRESHOLD = 20;

function checkHitPossible(board: Board, p: Point, allowedPoint: Point) {
    for (let i = p.row - 1; i <= p.row + 1; i++) {
        for (let j = p.col - 1; j <= p.col + 1; j++) {
            if ((0 <= i && i < BOARD_SIZE) && (0 <= j && j < BOARD_SIZE)) {
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

export function calculateNextMove(board: Board): Point {
    // checking rows
    for (let i = 0; i < BOARD_SIZE; i++) {
        let l = 0;
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === CellState.Hit) {
                l++;
            }
            if (board[i][j] !== CellState.Hit || j === BOARD_SIZE - 1) {
                if (l > 0) {
                    const start = j - l - (j === BOARD_SIZE - 1 ? 0 : 1);
                    const leftPoint: Point = {row: i, col: start};
                    if (start >= 0 && checkHitPossible(board, leftPoint, {row: i, col: start + 1})) {
                        return leftPoint;
                    }
                    const rightPoint: Point = {row: i, col: j};
                    if (j < BOARD_SIZE - 1 && checkHitPossible(board, rightPoint, {row: i, col: j - 1})) {
                        return rightPoint;
                    }
                }
                l = 0;
            }
        }
    }

    // checking columns
    for (let j = 0; j < BOARD_SIZE; j++) {
        let l = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (board[i][j] === CellState.Hit) {
                l++;
            }
            if (board[i][j] !== CellState.Hit || i === BOARD_SIZE - 1) {
                if (l > 0) {
                    const start = i - l - (i === BOARD_SIZE - 1 ? 0 : 1);
                    const topPoint: Point = {row: start, col: j};
                    if (start >= 0 && checkHitPossible(board, topPoint, {row: start + 1, col: j})) {
                        return topPoint;
                    }
                    const bottomPoint: Point = {row: i, col: j};
                    if (i < BOARD_SIZE - 1 && checkHitPossible(board, bottomPoint, {row: i - 1, col: j})) {
                        return bottomPoint;
                    }
                }
                l = 0;
            }
        }
    }

    let c = 0;
    while (true) {
        c++;
        const randomPos = {row: random(0, BOARD_SIZE), col: random(0, BOARD_SIZE)};
        if (board[randomPos.row][randomPos.col] === CellState.Default) {
            return randomPos;
        }
        if (c > RANDOM_POSITION_ATTEMPT_THRESHOLD) {
            for (let i = 0; i < BOARD_SIZE; i++) {
                for (let j = 0; j < BOARD_SIZE; j++) {
                    if (board[randomPos.row][randomPos.col] === CellState.Default) {
                        return {row: i, col: j};
                    }
                }
            }
        }
    }
}