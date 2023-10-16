import {BOARD_SIZE, Board} from 'core/types/Board';
import {CellState} from 'core/types/CellState';

export function generateBoard(): Board {
    return Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(CellState.Default));
}