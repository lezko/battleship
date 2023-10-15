import {useState} from 'react';
import {generateRandomShipArrangement} from 'core/bot/generateRandomShipArrangement';
import {OfflineGame} from 'core/game/OfflineGame';
import {Player} from 'core/types/Player';
import {random} from 'core/bot/random';
import Board from 'components/Board';
import {IPoint} from 'core/types/IShip';
import {getOpponent} from 'core/getOpponent';

const TwoPlayersGame = () => {
    const [game, setGame] = useState(new OfflineGame(generateRandomShipArrangement(), generateRandomShipArrangement()));
    const [ships, setShips] = useState([game.getShipsCopy(Player.First), game.getShipsCopy(Player.Second)]);
    const [boards, setBoards] = useState([game.getBoardCopy(Player.First), game.getBoardCopy(Player.Second)]);
    const [currentPlayer, setCurrentPlayer] = useState(random(0, 2));
    const [shipsVisible, setShipsVisible] = useState([false, false]);

    function makeMove(p: IPoint, player: Player) {
        if (currentPlayer !== player) {
            return;
        }
        const res = game.makeMove(p, player);
        const opponent = getOpponent(player);

        const nextBoards = boards.slice();
        nextBoards[opponent] = res.board;
        setBoards(nextBoards);

        const nextShips = ships.slice();
        nextShips[opponent] = res.ships;
        setShips(nextShips);

        setCurrentPlayer(opponent);
    }

    function getPlayerSideHtml(player: Player) {
        return (
            <div style={{border: `1px solid ${currentPlayer !== player ? 'black' : 'transparent'}`}}>
                <Board
                    board={boards[player]}
                    ships={shipsVisible[player] ? ships[player] : null}
                    makeMove={(p) => makeMove(p, getOpponent(player))}
                    canMakeMove={currentPlayer !== player}
                />
                <button onClick={() => {
                    const nextShipsVisible = shipsVisible.slice();
                    nextShipsVisible[player] = !nextShipsVisible[player];
                    setShipsVisible(nextShipsVisible);
                }}>show ships
                </button>
            </div>
        );
    }

    return (
        <div style={{display: 'flex'}}>
            {getPlayerSideHtml(Player.First)}
            {getPlayerSideHtml(Player.Second)}
        </div>
    );
};

export default TwoPlayersGame;