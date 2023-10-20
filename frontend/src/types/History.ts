import {GameMode} from 'shared/src/types/GameMode';
import {GameShootMode} from 'shared/src/types/GameShootMode';
import {Player} from 'shared/src/types/Player';
import {getFromLocalStorage, saveToLocalStorage} from 'utils/localStorage';

const historyLocalStorageName = 'history';

export interface HistoryItem {
    gameMode: GameMode;
    gameShootMode: GameShootMode;
    playerNames: [string, string];
    winner: Player | null;
}

export type History = HistoryItem[];

export function getHistory(): History {
    return getFromLocalStorage(historyLocalStorageName) as History;
}

export function saveHistory(history: History) {
    saveToLocalStorage(historyLocalStorageName, history);
}

if (getHistory() === null) {
    saveHistory([]);
}
