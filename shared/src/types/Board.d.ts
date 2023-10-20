import { CellState } from 'types/CellState';
export declare const BOARD_SIZE = 10;
export type Board = CellState[][];
export declare function generateBoard(): Board;
