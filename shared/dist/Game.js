"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Board_1 = require("./types/Board");
const Ship_1 = require("./types/Ship");
const CellState_1 = require("./types/CellState");
const Player_1 = require("./types/Player");
function markShipSunk(board, ship) {
    for (let i = ship.position.start.row - 1; i <= ship.position.end.row + 1; i++) {
        for (let j = ship.position.start.col - 1; j <= ship.position.end.col + 1; j++) {
            if ((ship.position.start.row <= i && i <= ship.position.end.row) &&
                (ship.position.start.col <= j && j <= ship.position.end.col)) {
                board[i][j] = CellState_1.CellState.Sunk;
            }
            else if ((0 <= i && i < Board_1.BOARD_SIZE) && (0 <= j && j < Board_1.BOARD_SIZE)) {
                board[i][j] = CellState_1.CellState.Miss;
            }
        }
    }
}
class Game {
    constructor(ships, boards) {
        this.winner = null;
        this.ships = ships;
        this.boards = boards;
        this.shipsSunk = [(0, Ship_1.getSunkShipsCount)(ships[Player_1.Player.First]), (0, Ship_1.getSunkShipsCount)(ships[Player_1.Player.Second])];
        if (this.shipsSunk[Player_1.Player.First] === Ship_1.shipsTotal) {
            this.winner = Player_1.Player.Second;
        }
        else if (this.shipsSunk[Player_1.Player.Second] === Ship_1.shipsTotal) {
            this.winner = Player_1.Player.First;
        }
    }
    makeMove(p, player) {
        const opponent = (0, Player_1.getOpponent)(player);
        const opponentShips = this.ships[opponent];
        const opponentBoard = this.boards[opponent];
        let shipHit = false;
        for (const ship of opponentShips) {
            for (let i = ship.position.start.row; i <= ship.position.end.row; i++) {
                for (let j = ship.position.start.col; j <= ship.position.end.col; j++) {
                    if (i === p.row && j === p.col && opponentBoard[i][j] !== CellState_1.CellState.Hit) {
                        ship.decksHit++;
                        opponentBoard[i][j] = CellState_1.CellState.Hit;
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
                opponentBoard[p.row][p.col] = CellState_1.CellState.Miss;
            }
        }
        if (this.shipsSunk[opponent] === Ship_1.shipsTotal) {
            this.winner = player;
        }
    }
    getBoard(player) {
        return this.boards[player];
    }
    getShips(player) {
        return this.ships[player];
    }
    getShipsSunk(player) {
        return this.shipsSunk[player];
    }
    getWinner() {
        return this.winner;
    }
}
exports.Game = Game;
