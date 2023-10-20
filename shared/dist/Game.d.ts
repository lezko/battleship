import { Board } from './types/Board';
import { Point, Ship } from './types/Ship';
import { Player } from './types/Player';
export declare class Game {
    private readonly ships;
    private readonly boards;
    private readonly shipsSunk;
    private winner;
    constructor(ships: [Ship[], Ship[]], boards: [Board, Board]);
    makeMove(p: Point, player: Player): void;
    getBoard(player: Player): Board;
    getShips(player: Player): Ship[];
    getShipsSunk(player: Player): number;
    getWinner(): Player | null;
}
