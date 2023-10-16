import {Fragment, useEffect, useRef, useState} from 'react';
import {OfflineGame} from 'core/game/OfflineGame';
import {getAliveShipsParams, Point} from 'core/types/Ship';
import Board from 'components/Board';
import {Player} from 'core/types/Player';
import {calculateNextMove} from 'core/bot/calculateNextMove';
import {setBoard, setGameInfo, setShips, useGameInfo} from 'store/gameInfoSlice';
import {useAppDispatch} from 'store';
import {clone} from 'utils/clone';
import {GameShootMode} from 'core/types/GameShootMode';
import {CellState} from 'core/types/CellState';
import {Modal} from 'antd';
import GameStatusPanel from 'components/GameStatusPanel';
import lang from 'language.json';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRobot} from '@fortawesome/free-solid-svg-icons';
import {getHistory, saveHistory} from 'core/types/History';
import TwoBoardGrid from 'components/layout/TwoBoardGrid';
import ShipSet from 'components/style/ShipSet';

export const computerName = <>{lang.computer} <FontAwesomeIcon icon={faRobot} /></>;

const OnePlayerGame = () => {
    const player = Player.First;
    const bot = Player.Second;

    const {ships, boards, currentPlayer, gameMode, gameShootMode, finishedEarly, playerNames} = useGameInfo();
    const dispatch = useAppDispatch();
    const [game, setGame] = useState(new OfflineGame(clone(ships), clone(boards)));
    const timerRef = useRef<any>();

    async function makeBotMove() {
        while (true) {
            const p = calculateNextMove(game.getBoard(player));
            game.makeMove(p, bot);
            // artificial delay to make game feel more natural
            await new Promise<void>(resolve => {
                timerRef.current = setTimeout(() => {
                    dispatch(setBoard({board: game.getBoardCopy(player), player: player}));
                    dispatch(setShips({ships: game.getShipsCopy(player), player: player}));
                    resolve();
                }, 1000);
            });
            if (gameShootMode === GameShootMode.OneByOne || game.getBoard(player)[p.row][p.col] === CellState.Miss) {
                dispatch(setGameInfo({currentPlayer: player}));
                break;
            }
            if (game.getWinner() !== null) {
                const history = getHistory();
                history.unshift({
                    gameMode,
                    gameShootMode,
                    playerNames,
                    winner: bot
                });
                saveHistory(history);
            }
        }
    }

    function makeMove(p: Point) {
        if (currentPlayer === bot) {
            return;
        }
        game.makeMove(p, player);
        dispatch(setBoard({board: game.getBoardCopy(bot), player: bot}));
        dispatch(setShips({ships: game.getShipsCopy(bot), player: bot}));

        if (gameShootMode === GameShootMode.OneByOne || game.getBoard(bot)[p.row][p.col] === CellState.Miss) {
            dispatch(setGameInfo({currentPlayer: bot}));
            makeBotMove();
        }

        if (game.getWinner() !== null) {
            const history = getHistory();
            history.unshift({
                gameMode,
                gameShootMode,
                playerNames,
                winner: player
            });
            saveHistory(history);
        }
    }

    useEffect(() => {
        if (currentPlayer === bot) {
            makeBotMove();
        }
    }, []);

    const gameInProgress = game.getWinner() === null && !finishedEarly;

    const [{confirm}, contextHolder] = Modal.useModal();

    function handleFinishGame() {
        confirm({

            title: lang.finishGameEarly,
            content: lang.confirmDefeat,
            okButtonProps: {type: 'default'},
            cancelText: lang.cancel,
            okText: lang.ok,
            closable: true,
            onOk() {
                clearInterval(timerRef.current);
                dispatch(setGameInfo({finishedEarly: true}));
                const history = getHistory();
                history.unshift({
                    gameMode,
                    gameShootMode,
                    playerNames,
                    winner: game.getWinner()
                });
                saveHistory(history);
            },
        });
    }

    function getSidePlayerHtml(p: Player) {
        const playerName = p === bot ? computerName : playerNames[player];
        return (
            <div>
                <Board
                    player={p}
                    shipsVisible={p === player || !gameInProgress}
                    canMakeMove={gameInProgress && currentPlayer !== p}
                    onClick={p === bot ? makeMove : undefined}
                />
                <h4 style={{fontStyle: 'italic', marginTop: 10, marginBottom: 20}}>{playerName}</h4>
                <ShipSet shipParams={getAliveShipsParams(ships[p])} />
            </div>
        );
    }

    return (
        <div>
            {contextHolder}
            <GameStatusPanel winner={game.getWinner()} onFinishGame={handleFinishGame} />
            <TwoBoardGrid>
                {getSidePlayerHtml(player)}
                {getSidePlayerHtml(bot)}
            </TwoBoardGrid>
        </div>
    );
};

export default OnePlayerGame;