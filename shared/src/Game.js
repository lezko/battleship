"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineGame = void 0;
var Board_1 = require("types/Board");
var Ship_1 = require("types/Ship");
var CellState_1 = require("types/CellState");
var Player_1 = require("types/Player");
function markShipSunk(board, ship) {
    for (var i = ship.position.start.row - 1; i <= ship.position.end.row + 1; i++) {
        for (var j = ship.position.start.col - 1; j <= ship.position.end.col + 1; j++) {
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
var OfflineGame = /** @class */ (function () {
    function OfflineGame(ships, boards) {
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
    OfflineGame.prototype.makeMove = function (p, player) {
        var opponent = (0, Player_1.getOpponent)(player);
        var opponentShips = this.ships[opponent];
        var opponentBoard = this.boards[opponent];
        var shipHit = false;
        for (var _i = 0, opponentShips_1 = opponentShips; _i < opponentShips_1.length; _i++) {
            var ship = opponentShips_1[_i];
            for (var i = ship.position.start.row; i <= ship.position.end.row; i++) {
                for (var j = ship.position.start.col; j <= ship.position.end.col; j++) {
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
    };
    OfflineGame.prototype.getBoard = function (player) {
        return this.boards[player];
    };
    OfflineGame.prototype.getShips = function (player) {
        return this.ships[player];
    };
    OfflineGame.prototype.getShipsSunk = function (player) {
        return this.shipsSunk[player];
    };
    OfflineGame.prototype.getWinner = function () {
        return this.winner;
    };
    return OfflineGame;
}());
exports.OfflineGame = OfflineGame;
