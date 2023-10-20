import {Board, BOARD_SIZE} from './types/Board';
import {getSunkShipsCount, Point, Ship, shipsTotal} from './types/Ship';
import {CellState} from './types/CellState';
import {getOpponent, Player} from './types/Player';

function markShipSunk(board: Board, ship: Ship) {
    for (let i = ship.position.start.row - 1; i <= ship.position.end.row + 1; i++) {
        for (let j = ship.position.start.col - 1; j <= ship.position.end.col + 1; j++) {
            if (
                (ship.position.start.row <= i && i <= ship.position.end.row) &&
                (ship.position.start.col <= j && j <= ship.position.end.col)
            ) {
                board[i][j] = CellState.Sunk;
            } else if ((0 <= i && i < BOARD_SIZE) && (0 <= j && j < BOARD_SIZE)) {
                board[i][j] = CellState.Miss;
            }
        }
    }
}

export class Game {

    private readonly ships: [Ship[], Ship[]];
    private readonly boards: [Board, Board];
    private readonly shipsSunk: [number, number];
    private winner: Player | null = null;

    constructor(ships: [Ship[], Ship[]], boards: [Board, Board]) {
        this.ships = ships;
        this.boards = boards;
        this.shipsSunk = [getSunkShipsCount(ships[Player.First]), getSunkShipsCount(ships[Player.Second])];
        if (this.shipsSunk[Player.First] === shipsTotal) {
            this.winner = Player.Second;
        } else if (this.shipsSunk[Player.Second] === shipsTotal) {
            this.winner = Player.First;
        }
    }

    public makeMove(p: Point, player: Player) {
        const opponent = getOpponent(player);
        const opponentShips = this.ships[opponent];
        const opponentBoard = this.boards[opponent];
        let shipHit = false;
        for (const ship of opponentShips) {
            for (let i = ship.position.start.row; i <= ship.position.end.row; i++) {
                for (let j = ship.position.start.col; j <= ship.position.end.col; j++) {
                    if (i === p.row && j === p.col && opponentBoard[i][j] !== CellState.Hit) {
                        ship.decksHit++;
                        opponentBoard[i][j] = CellState.Hit;
                        if (ship.decksHit === ship.size) {
                            markShipSunk(opponentBoard, ship);
                            this.shipsSunk[opponent]++;
                        }
                        shipHit = true;
                        break;
                    }
                }
                if (shipHit) {
                    break;
                }
            }
            if (shipHit) {
                break;
            }
            if (!shipHit) {
                opponentBoard[p.row][p.col] = CellState.Miss;
            }
        }
        if (this.shipsSunk[opponent] === shipsTotal) {
            this.winner = player;
        }
    }

    public getBoard(player: Player) {
        return this.boards[player];
    }

    public getShips(player: Player) {
        return this.ships[player];
    }

    public getShipsSunk(player: Player) {
        return this.shipsSunk[player];
    }

    public getWinner(): Player | null {
        return this.winner;
    }
}