import {Player} from 'core/types/Player';

export function getOpponent(player: Player) {
    return player === Player.First ? Player.Second : Player.First;
}