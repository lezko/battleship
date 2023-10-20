import { Board } from 'types/Board';
import { Point, Ship } from 'types/Ship';
import { Player } from 'types/Player';
export declare class OfflineGame {
    private readonly ships;
    private readonly boards;
    private readonly shipsSunk;
    private winner;
    constructor(ships: [Ship[], Ship[]], boards: [Board, Board]);
    makeMove(p: Point, player: Player): void;
    getBoard(player: Player): any;
    getShips(player: Player): Ship[];
    getShipsSunk(player: Player): number;
    getWinner(): Player | null;
}
