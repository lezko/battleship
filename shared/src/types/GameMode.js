"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMode = void 0;
var GameMode;
(function (GameMode) {
    GameMode[GameMode["OnePlayer"] = 0] = "OnePlayer";
    GameMode[GameMode["TwoPlayers"] = 1] = "TwoPlayers";
    GameMode[GameMode["OnlineGame"] = 2] = "OnlineGame";
})(GameMode || (exports.GameMode = GameMode = {}));
