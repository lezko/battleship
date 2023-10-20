"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rand = void 0;
function rand(a, b) {
    return Math.floor(Math.random() * (b - a)) + a;
}
exports.rand = rand;
