import {BOARD_SIZE, IBoard} from 'core/types/IBoard';
import {CellState} from 'core/types/CellState';

export function generateBoard(): IBoard {
    return Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(CellState.Default));
}