import {CellState} from './CellState';

export const BOARD_SIZE = 10;

export type Board =  CellState[][];

export function generateBoard(): Board {
    return Array.from(Array(BOARD_SIZE), () => Array(BOARD_SIZE).fill(CellState.Default));
}