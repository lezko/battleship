export enum Player {
    First = 0,
    Second = 1
}

export function getOpponent(player: Player) {
    return player === Player.First ? Player.Second : Player.First;
}