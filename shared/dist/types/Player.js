"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpponent = exports.Player = void 0;
var Player;
(function (Player) {
    Player[Player["First"] = 0] = "First";
    Player[Player["Second"] = 1] = "Second";
})(Player || (exports.Player = Player = {}));
function getOpponent(player) {
    return player === Player.First ? Player.Second : Player.First;
}
exports.getOpponent = getOpponent;
