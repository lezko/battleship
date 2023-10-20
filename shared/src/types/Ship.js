"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillRange = exports.checkCanPlaceShip = exports.checkCanPlaceShipWithOtherShips = exports.getSunkShipsCount = exports.shipsTotal = exports.shipParameters = void 0;
var Board_1 = require("../types/Board");
/**
 * Parameters of ships available in the game.
 * @key size of the ship (number of decks)
 * @value amount of ships of corresponding size
 */
exports.shipParameters = {
    1: 4, 2: 3, 3: 2, 4: 1
};
exports.shipsTotal = Object.values(exports.shipParameters).reduce(function (n, v) {
    n += v;
    return n;
}, 0);
function getSunkShipsCount(ships) {
    return ships.reduce(function (n, s) {
        if (s.decksHit === s.size) {
            n++;
        }
        return n;
    }, 0);
}
exports.getSunkShipsCount = getSunkShipsCount;
function checkCanPlaceShipWithOtherShips(p, otherShips) {
    var field = Array.from(Array(Board_1.BOARD_SIZE), function () { return Array(Board_1.BOARD_SIZE).fill(false); });
    for (var _i = 0, otherShips_1 = otherShips; _i < otherShips_1.length; _i++) {
        var ship = otherShips_1[_i];
        fillRange(ship.position, field);
    }
    return checkCanPlaceShip(p, field);
}
exports.checkCanPlaceShipWithOtherShips = checkCanPlaceShipWithOtherShips;
function checkCanPlaceShip(p, field) {
    for (var i = p.start.row - 1; i <= p.end.row + 1; i++) {
        for (var j = p.start.col - 1; j <= p.end.col + 1; j++) {
            if ((0 <= i && i < Board_1.BOARD_SIZE) && (0 <= j && i < Board_1.BOARD_SIZE)) {
                if (field[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}
exports.checkCanPlaceShip = checkCanPlaceShip;
function fillRange(p, field) {
    for (var i = p.start.row; i <= p.end.row; i++) {
        for (var j = p.start.col; j <= p.end.col; j++) {
            field[i][j] = true;
        }
    }
}
exports.fillRange = fillRange;
