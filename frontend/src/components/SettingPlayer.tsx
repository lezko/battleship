import {resetGame, setPlayerName, setShips, useGameInfo} from 'store/gameInfoSlice';
import {GameStatus, setGameStatus, useGameStatus} from 'store/gameStatusSlice';
import {Player} from 'core/types/Player';
import {useAppDispatch} from 'store';
import lang from 'language.json';
import Board from 'components/Board';
import {
    checkCanPlaceShipWithOtherShips,
    generateRandomShipArrangement,
    normalizeShipPosition
} from 'core/bot/generateRandomShipArrangement';
import {GameMode} from 'core/types/GameMode';
import {Button, Flex, Input} from 'antd';
import styled from 'styled-components';
import {getRemainingShipsParams, Point, Ship, shipsTotal} from 'core/types/Ship';
import ShipSet from 'components/style/ShipSet';
import {useState} from 'react';
import {BOARD_SIZE} from 'core/types/Board';

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
    const [firstPoint, setFirstPoint] = useState<Point | null>(null);
    const remainingShipsParams = getRemainingShipsParams(ships[player]);

    // fixme omega non-optimal
    function checkPointIsOnShip(p: Point, ships: Ship[]): Ship | null {
        for (const ship of ships) {
            if (
                (ship.position.start.row <= p.row && p.row <= ship.position.end.row) &&
                (ship.position.start.col <= p.col && p.col <= ship.position.end.col)
            ) {
                return ship;
            }
        }
        return null;
    }

    function checkShipsAround(p: Point, ships: Ship[]) {
        for (let i = p.row - 1; i <= p.row + 1; i++) {
            for (let j = p.col - 1; j <= p.col + 1; j++) {
                if ((0 <= i && i < BOARD_SIZE) && (0 <= j && j < BOARD_SIZE)) {
                    if (checkPointIsOnShip({row: i, col: j}, ships) !== null) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function handleClick(p: Point) {
        if (firstPoint === null) {
            const ship = checkPointIsOnShip(p, ships[player]);
            if (ship !== null) {
                dispatch(setShips({
                    ships: ships[player].filter(s => s !== ship),
                    player: player
                }));
                return;
            }
            if (checkShipsAround(p, ships[player]) || ships[player].length === shipsTotal) {
                return;
            }

            setFirstPoint(p);
        } else {
            if (p.row === firstPoint.row || p.col === firstPoint.col) {
                const size = Math.max(Math.abs(p.row - firstPoint.row) + 1, Math.abs(p.col - firstPoint.col) + 1);
                const position = normalizeShipPosition({start: {row: firstPoint.row, col: firstPoint.col}, end: p});
                if (remainingShipsParams[size] > 0 && checkCanPlaceShipWithOtherShips(position, ships[player])) {
                    dispatch(setShips({ships: [...ships[player], {size, position, decksHit: 0}], player}));
                }
            }
            setFirstPoint(null);
        }
    }

    let inputLabelText = lang.inputYourName;
    if (gameMode === GameMode.TwoPlayers) {
        inputLabelText = `${lang.player} ${player + 1}: ${inputLabelText}`
    }
    return (
        <StyledDiv>
            <Flex style={{marginBottom: 20}} justify="space-between">
                <Button onClick={navigateBackward}>{lang.back}</Button>
                <Button disabled={!canGoForward} onClick={navigateForward}>{nextBtnText}</Button>
            </Flex>

            <div>
                <label style={{display: 'inline-block', marginBottom: 5}} htmlFor={id}>
                    {inputLabelText}
                </label>
                <Input
                    id={id}
                    type="text"
                    value={playerNames[player]}
                    onChange={e => {
                        dispatch(setPlayerName({playerName: e.target.value, player: player}));
                    }}
                />
            </div>

            <i style={{fontSize: '.9rem', display: 'inline-block', marginTop: 15}}>{lang.shipArrangementInstructions}</i>

            <Flex justify="space-between" align="center" gap={5}>
                <Button onClick={() => dispatch(setShips({ships: generateRandomShipArrangement(), player: player}))}>
                    {lang.arrangeShipsRandomly}
                </Button>
                <Button onClick={() => dispatch(setShips({ships: [], player: player}))}>{lang.clear}</Button>
            </Flex>

            <Board
                player={player}
                shipsVisible={true}
                canMakeMove={true}
                onClick={handleClick}
                markedCell={firstPoint || undefined}
            />
            <div style={{marginTop: 20}}>
                <ShipSet shipParams={remainingShipsParams} />
            </div>
        </StyledDiv>
    );
};

export default SettingPlayer;