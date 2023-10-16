import {configureStore, createListenerMiddleware, isAnyOf} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {getFromLocalStorage, saveToLocalStorage} from 'utils/localStorage';
import gameStatusReducer, {gameStatusSliceName, setGameStatus} from 'store/gameStatusSlice';
import gameInfoReducer, {
    gameInfoSliceName,
    resetGame,
    resetInfo,
    setBoard,
    setGameInfo, setPlayerName,
    setShips
} from 'store/gameInfoSlice';

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    actionCreator: setGameStatus,
    effect(action, listenerApi) {
        saveToLocalStorage(gameStatusSliceName, (listenerApi.getState() as RootState).gameStatus);
    },
});
listenerMiddleware.startListening({
    matcher: isAnyOf(setGameInfo, setBoard, setShips, setPlayerName, resetInfo, resetGame),
    effect(action, listenerApi) {
        saveToLocalStorage(gameInfoSliceName, (listenerApi.getState() as RootState).gameInfo);
    },
});

export const store = configureStore({
    reducer: {
        gameStatus: gameStatusReducer,
        gameInfo: gameInfoReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function combineInitialStateWithSavedState<T>(initialState: T, name: string): T {
    const savedState = getFromLocalStorage(name);
    if (savedState === null) {
        saveToLocalStorage(name, initialState);
    } else {
        initialState = {...initialState, ...savedState};
        saveToLocalStorage(name, initialState);
    }
    return initialState;
}