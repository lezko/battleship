import {IPoint, IShip} from 'core/types/IShip';
import {CellState} from 'core/types/CellState';
import {IBoard} from 'core/types/IBoard';
import {generateBoard} from 'core/generateBoard';
import {Player} from 'core/types/Player';
import {getOpponent} from 'core/getOpponent';

export interface MoveResult {
    board: IBoard;
    ships: IShip[];
    winner?: Player;
}

function clone<T>(value: T) {
    return JSON.parse(JSON.stringify(value)) as T;
}

export class OfflineGame {

    private readonly ships: [IShip[], IShip[]];
    private readonly boards = [generateBoard(), generateBoard()];
    private shipsSunk = [0, 0];

    constructor(firstPlayerShips: IShip[], secondPlayerShips: IShip[]) {
        this.ships = [firstPlayerShips, secondPlayerShips];
    }

    public makeMove(p: IPoint, player: Player): MoveResult {
        const opponent = getOpponent(player);
        const opponentShips = this.ships[opponent];
        const opponentBoard = this.boards[opponent];
        let shipHit = false;
        for (const ship of opponentShips) {
            for (let i = ship.position.start.row; i <= ship.position.end.row; i++) {
                for (let j = ship.position.start.col; j <= ship.position.end.col; j++) {
                    if (i === p.row && j === p.col && opponentBoard[i][j] !== CellState.Hit) {
                        ship.decksHit++;
                        opponentBoard[i][j] = ship.decksHit < ship.size ? CellState.Hit : CellState.Sunk;
                        if (opponentBoard[i][j] === CellState.Sunk) {
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
        const moveResult: MoveResult = {board: clone(opponentBoard), ships: clone(opponentShips)};
        if (this.shipsSunk[opponent] === 10) {
            moveResult.winner = player;
        }
        return moveResult;
    }

    public getBoardCopy(player: Player) {
        return clone(this.boards[player]);
    }

    public getShipsCopy(player: Player) {
        return clone(this.ships[player]);
    }

    public getShipsSunk(player: Player) {
        return this.shipsSunk[player];
    }
}