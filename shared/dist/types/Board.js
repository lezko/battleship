"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBoard = exports.BOARD_SIZE = void 0;
const CellState_1 = require("./CellState");
exports.BOARD_SIZE = 10;
function generateBoard() {
    return Array.from(Array(exports.BOARD_SIZE), () => Array(exports.BOARD_SIZE).fill(CellState_1.CellState.Default));
}
exports.generateBoard = generateBoard;
