"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBoard = exports.BOARD_SIZE = void 0;
var CellState_1 = require("types/CellState");
exports.BOARD_SIZE = 10;
function generateBoard() {
    return Array.from(Array(exports.BOARD_SIZE), function () { return Array(exports.BOARD_SIZE).fill(CellState_1.CellState.Default); });
}
exports.generateBoard = generateBoard;
