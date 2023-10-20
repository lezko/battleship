import {useRef, useState} from 'react';
import {CellState, Game, GameShootMode, getOpponent, Player, Point} from 'shared';
import Board from 'components/Board';
import {setBoard, setGameInfo, setShips, useGameInfo} from 'store/gameInfoSlice';
import {useAppDispatch} from 'store';
import {clone} from 'utils/clone';
import {Button, Flex, Modal} from 'antd';
import GameStatusPanel from 'components/GameStatusPanel';
import lang from 'language.json';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {getHistory, saveHistory} from 'types/History';
import TwoBoardGrid from 'components/layout/TwoBoardGrid';
import ShipSet from 'components/style/ShipSet';
import {getAliveShipsParams} from 'utils/shipUtils';

const SHOW_SHIPS_DELAY = 3;

const TwoPlayersGame = () => {
    const {ships, boards, currentPlayer, finishedEarly, gameMode, gameShootMode, playerNames} = useGameInfo();
    const dispatch = useAppDispatch();
    const [game, setGame] = useState<Game>(new Game(clone(ships), clone(boards)));

    const showShipsText = <>{lang.showShips} <FontAwesomeIcon icon={faEye} /></>;
    const hideShipsText = <>{lang.hideShips} <FontAwesomeIcon icon={faEyeSlash} /></>;
    const [firstPlayerShipsVisible, setFirstPlayerShipsVisible] = useState(false);
    const [secondPlayerShipsVisible, setSecondPlayerShipsVisible] = useState(false);
    const firstRef = useRef<any>(null);
    const secondRef = useRef<any>(null);
    const [firstVisibilityText, setFirstVisibilityText] = useState(showShipsText);
    const [secondVisibilityText, setSecondVisibilityText] = useState(showShipsText);

    function makeMove(p: Point, player: Player) {
        if (currentPlayer !== player) {
            return;
        }
        game.makeMove(p, player);
        const opponent = getOpponent(player);

        dispatch(setBoard({board: clone(game.getBoard(opponent)), player: opponent}));
        dispatch(setShips({ships: clone(game.getShips(opponent)), player: opponent}));

        if (gameShootMode === GameShootMode.OneByOne || game.getBoard(opponent)[p.row][p.col] === CellState.Miss) {
            dispatch(setGameInfo({currentPlayer: opponent}));
        }

        if (game.getWinner() !== null) {
            const history = getHistory();
            history.unshift({
                gameMode,
                gameShootMode,
                playerNames,
                winner: game.getWinner()
            });
            saveHistory(history);
        }
    }

    function handleShowShipsClick(player: Player) {
        if (player === Player.First) {
            if (firstPlayerShipsVisible) {
                setFirstPlayerShipsVisible(false);
                setFirstVisibilityText(showShipsText);
                return;
            }
            if (firstRef.current !== null) {
                clearInterval(firstRef.current);
                firstRef.current = null;
                setFirstVisibilityText(showShipsText);
            } else {
                let c = SHOW_SHIPS_DELAY;
                const tick = () => {
                    setFirstVisibilityText(<>{lang.cancel} ({c})</>);
                    c--;
                };
                tick();
                const interval = setInterval(() => {
                    tick();
                    if (c < 0) {
                        clearInterval(interval);
                        firstRef.current = null;
                        setFirstVisibilityText(hideShipsText);
                        setFirstPlayerShipsVisible(true);
                    }
                }, 1000);
                firstRef.current = interval;
            }
        } else {
            if (secondPlayerShipsVisible) {
                setSecondPlayerShipsVisible(false);
                setSecondVisibilityText(showShipsText);
                return;
            }
            if (secondRef.current !== null) {
                clearInterval(secondRef.current);
                secondRef.current = null;
                setSecondVisibilityText(showShipsText);
            } else {
                let c = SHOW_SHIPS_DELAY;
                const tick = () => {
                    setSecondVisibilityText(<>{lang.cancel} ({c})</>);
                    c--;
                };
                tick();
                const interval = setInterval(() => {
                    tick();
                    if (c < 0) {
                        clearInterval(interval);
                        secondRef.current = null;
                        setSecondVisibilityText(hideShipsText);
                        setSecondPlayerShipsVisible(true);
                    }
                }, 1000);
                secondRef.current = interval;
            }
        }
    }

    const gameInProgress = game.getWinner() === null && !finishedEarly;

    function getPlayerSideHtml(player: Player) {
        const shipsVisible = player === Player.First ? firstPlayerShipsVisible : secondPlayerShipsVisible;
        const shipsVisibilityText = player === Player.First ? firstVisibilityText : secondVisibilityText;
        return (
            <div>
                <Board
                    canMakeMove={gameInProgress && currentPlayer !== player}
                    player={player}
                    shipsVisible={shipsVisible || !gameInProgress}
                    onClick={(p) => makeMove(p, getOpponent(player))}
                />
                <Flex style={{marginTop: 10, marginBottom: 20}} justify="space-between" align="center">
                    <h4 style={{fontStyle: 'italic'}}>{playerNames[player]}</h4>
                    {gameInProgress && <Button onClick={() => handleShowShipsClick(player)}>
                        {shipsVisibilityText}
                    </Button>}
                </Flex>
                <ShipSet shipParams={getAliveShipsParams(ships[player])} />
            </div>
        );
    }

    const [{confirm}, contextHolder] = Modal.useModal();

    function handleFinishGame() {
        confirm({
            title: lang.finishGameEarly,
            okButtonProps: {type: 'default'},
            cancelText: lang.cancel,
            okText: lang.ok,
            closable: true,
            onOk() {
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

    return (
        <div>
            {contextHolder}
            <GameStatusPanel winner={game.getWinner()} onFinishGame={handleFinishGame} />
            <TwoBoardGrid>
                <div style={{flexGrow: 1}}>{getPlayerSideHtml(Player.First)}</div>
                <div style={{flexGrow: 1}}>{getPlayerSideHtml(Player.Second)}</div>
            </TwoBoardGrid>
        </div>
    );
};

export default TwoPlayersGame;