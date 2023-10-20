import {useEffect, useState} from 'react';
import {OnlineGameClient} from 'game/OnlineGameClient';
import {setBoard, setGameInfo, setShips, useGameInfo} from 'store/gameInfoSlice';
import {getOpponent, Player} from 'shared';
import {useAppDispatch} from 'store';
import GameStatusPanel from 'components/GameStatusPanel';
import TwoBoardGrid from 'components/layout/TwoBoardGrid';
import Board from 'components/Board';
import {Flex} from 'antd';
import ShipSet from 'components/style/ShipSet';
import {getAliveShipsParams} from 'utils/shipUtils';

const OnlineGame = () => {
    const {ships: localShips, boards: localBoards, currentPlayer: localCurrentPlayer, playerNames} = useGameInfo();
    const [gameInProgress, setGameInProgress] = useState(false);
    const dispatch = useAppDispatch();
    const [winner, setWinner] = useState<Player | null>(null);
    const [game, setGame] = useState<OnlineGameClient | undefined>();

    useEffect(() => {
        setGame(new OnlineGameClient(
            localShips[Player.First],
            ({ships, board, currentPlayer, previousPlayer}) => {
                const player = getOpponent(previousPlayer);
                dispatch(setBoard({board, player: player}));
                if (player === Player.First) {
                    dispatch(setShips({ships, player: player}));
                }
                dispatch(setGameInfo({currentPlayer}));
                setGameInProgress(true);
            }
        ));
    }, []);

    function getPlayerSideHtml(player: Player) {
        const playerName = player === Player.First ? playerNames[Player.First] : 'Online Player';
        const canMakeMove = gameInProgress && (player === Player.First && localCurrentPlayer === Player.Second);
        return (
            <div>
                <Board
                    canMakeMove={canMakeMove}
                    player={player}
                    shipsVisible={player === Player.First}
                    onClick={(p) => game?.makeMove(p)}
                />
                <Flex style={{marginTop: 10, marginBottom: 20}} justify="space-between" align="center">
                    <h4 style={{fontStyle: 'italic'}}>{playerName}</h4>
                </Flex>
                <ShipSet shipParams={getAliveShipsParams(localShips[player])} />
            </div>
        );
    }


    return (
        <div>
            <GameStatusPanel winner={winner} onFinishGame={() => {
            }} />
            <TwoBoardGrid>
                <div style={{flexGrow: 1}}>{getPlayerSideHtml(Player.First)}</div>
                <div style={{flexGrow: 1}}>{getPlayerSideHtml(Player.Second)}</div>
            </TwoBoardGrid>
        </div>
    );
};

export default OnlineGame;