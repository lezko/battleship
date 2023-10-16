import {GameMode} from 'core/types/GameMode';
import {GameShootMode} from 'core/types/GameShootMode';
import {Board} from 'core/types/Board';
import {Ship} from 'core/types/Ship';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {combineInitialStateWithSavedState, useAppSelector} from 'store/index';
import {Player} from 'core/types/Player';
import {generateBoard} from 'core/generateBoard';
import {random} from 'core/bot/random';
import {Simulate} from 'react-dom/test-utils';
import play = Simulate.play;

export const gameInfoSliceName = 'gameInfo';
export interface GameInfoState {
    gameMode: GameMode;
    gameShootMode: GameShootMode;
    playerNames: [string, string];
    boards: [Board, Board];
    ships: [Ship[], Ship[]];
    currentPlayer: Player;
    finishedEarly: boolean;
}

const initialState: GameInfoState = {
    gameMode: GameMode.OnePlayer,
    gameShootMode: GameShootMode.OneByOne,
    playerNames: ['', ''],
    boards: [generateBoard(), generateBoard()],
    ships: [[], []],
    currentPlayer: random(0, 2),
    finishedEarly: false,
};

export const gameInfoSlice = createSlice({
    name: gameInfoSliceName,
    initialState: combineInitialStateWithSavedState(initialState, gameInfoSliceName),
    reducers: {
        setGameInfo(state, action: PayloadAction<Partial<GameInfoState>>) {
            return {...state, ...action.payload};
        },
        setBoard(state, action: PayloadAction<{ board: Board, player: Player; }>) {
            state.boards[action.payload.player] = action.payload.board
        },
        setShips(state, action: PayloadAction<{ ships: Ship[], player: Player; }>) {
            state.ships[action.payload.player] = action.payload.ships;
        },
        setPlayerName(state, action: PayloadAction<{ playerName: string, player: Player; }>) {
            state.playerNames[action.payload.player] = action.payload.playerName;
        },
        resetInfo(state) {
            return  {...initialState};
        },
        resetGame(state) {
            state.boards = initialState.boards;
            state.ships = initialState.ships;
            state.currentPlayer = random(0, 2);
            state.finishedEarly = false;
        },
    }
});

export const {setGameInfo, setBoard, setShips, setPlayerName, resetInfo, resetGame} = gameInfoSlice.actions;
export default gameInfoSlice.reducer;

export function useGameInfo(): GameInfoState {
    return useAppSelector(state => state.gameInfo);
}