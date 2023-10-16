import {resetGame, setPlayerName, setShips, useGameInfo} from 'store/gameInfoSlice';
import {GameStatus, setGameStatus, useGameStatus} from 'store/gameStatusSlice';
import {Player} from 'core/types/Player';
import {useAppDispatch} from 'store';
import lang from 'language.json';
import Board from 'components/Board';
import {generateRandomShipArrangement} from 'core/bot/generateRandomShipArrangement';
import {GameMode} from 'core/types/GameMode';
import {Button, Flex, Input} from 'antd';
import styled from 'styled-components';
import {shipsTotal} from 'core/types/Ship';

const id = String(Math.random());
const MAX_WIDTH = 500;

const StyledDiv = styled.div`
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;

  & > * + * {
    margin-top: 10px;
  }
`;

const SettingPlayer = () => {
    const {playerNames, gameMode, ships} = useGameInfo();
    const {status} = useGameStatus();
    const player = status === GameStatus.SettingFirstPlayer ? Player.First : Player.Second;
    const dispatch = useAppDispatch();

    let nextBtnText;
    if (gameMode === GameMode.OnePlayer) {
        nextBtnText = lang.startGame;
    } else {
        if (status === GameStatus.SettingFirstPlayer) {
            nextBtnText = lang.next;
        } else {
            nextBtnText = lang.startGame;
        }
    }

    function navigateBackward() {
        const nextGameStatus = status === GameStatus.SettingFirstPlayer ? GameStatus.Idle : GameStatus.SettingFirstPlayer;
        dispatch(setGameStatus(nextGameStatus));
        if (nextGameStatus === GameStatus.Idle) {
            dispatch(resetGame());
        }
    }

    function navigateForward() {
        let nextGameStatus;
        if (gameMode === GameMode.TwoPlayers && status === GameStatus.SettingFirstPlayer) {
            nextGameStatus = GameStatus.SettingSecondPlayer;
        } else {
            if (gameMode === GameMode.OnePlayer) {
                dispatch(setShips({ships: generateRandomShipArrangement(), player: Player.Second}));
            }
            nextGameStatus = GameStatus.Playing;
        }
        dispatch(setGameStatus(nextGameStatus));
    }

    const canGoForward = ships[player].length === shipsTotal && (playerNames[player].trim()).length > 0;

    return (
        <StyledDiv>
            <Flex justify="space-between">
                <Button onClick={navigateBackward}>{lang.back}</Button>
                <Button disabled={!canGoForward} onClick={navigateForward}>{nextBtnText}</Button>
            </Flex>

            <div>
                <label style={{display: 'inline-block', marginBottom: 5}} htmlFor={id}>{lang.inputYourName}</label>
                <Input
                    id={id}
                    type="text"
                    value={playerNames[player]}
                    onChange={e => {
                        dispatch(setPlayerName({playerName: e.target.value, player: player}));
                    }}
                />
            </div>

            <Flex justify="space-between" align="center" gap={5}>
                <Button onClick={() => dispatch(setShips({ships: generateRandomShipArrangement(), player: player}))}>
                    {lang.arrangeShipsRandomly}
                </Button>
                <Button onClick={() => dispatch(setShips({ships: [], player: player}))}>{lang.clear}</Button>
            </Flex>

            <Board player={player} shipsVisible={true} canMakeMove={false} />
        </StyledDiv>
    );
};

export default SettingPlayer;