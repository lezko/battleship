"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSunkShipsCount = exports.shipsTotal = exports.shipParameters = void 0;
/**
 * Parameters of ships available in the game.
 * @key size of the ship (number of decks)
 * @value amount of ships of corresponding size
 */
exports.shipParameters = {
    1: 4, 2: 3, 3: 2, 4: 1
};
exports.shipsTotal = Object.values(exports.shipParameters).reduce((n, v) => {
    n += v;
    return n;
}, 0);
function getSunkShipsCount(ships) {
    return ships.reduce((n, s) => {
        if (s.decksHit === s.size) {
            n++;
        }
        return n;
    }, 0);
}
exports.getSunkShipsCount = getSunkShipsCount;
