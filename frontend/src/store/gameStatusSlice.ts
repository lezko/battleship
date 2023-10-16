import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, combineInitialStateWithSavedState, store, useAppSelector} from 'store/index';

export const gameStatusSliceName = 'gameStatus';

export enum GameStatus {
    Idle = -1,
    SettingFirstPlayer = 0,
    SettingSecondPlayer = 1,
    Playing = 2
}

export interface GameStatusState {
    status: GameStatus;
}

let initialState: GameStatusState = {
    status: GameStatus.Idle
};

export const gameStatusSlice = createSlice({
    name: gameStatusSliceName,
    initialState: combineInitialStateWithSavedState(initialState, gameStatusSliceName),
    reducers: {
        setGameStatus(state, action: PayloadAction<GameStatus>) {
            state.status = action.payload;
        },
    }
});

export const {setGameStatus} = gameStatusSlice.actions;
export default gameStatusSlice.reducer;

export function useGameStatus(): GameStatusState {
    return useAppSelector(state => state.gameStatus);
}

