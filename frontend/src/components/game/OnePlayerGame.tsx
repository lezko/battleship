import {Fragment, useEffect, useState} from 'react';
import {generateRandomShipArrangement} from 'core/bot/generateRandomShipArrangement';
import {OfflineGame} from 'core/game/OfflineGame';
import {IPoint} from 'core/types/IShip';
import GlobalStyle from 'GlobalStyle';
import Board from 'components/Board';
import {Player} from 'core/types/Player';
import {random} from 'core/bot/random';
import {calculateNextMove} from 'core/bot/calculateNextMove';

const OnePlayerGame = () => {
    const player = Player.First;
    const bot = Player.Second;

    const [ships, setShips] = useState(generateRandomShipArrangement());
    const [game, setGame] = useState(new OfflineGame(ships, generateRandomShipArrangement()));
    const [playerBoard, setPlayerBoard] = useState(game.getBoardCopy(player));
    const [botBoard, setBotBoard] = useState(game.getBoardCopy(bot));
    const [currentPlayer, setCurrentPlayer] = useState(random(0, 2));

    function makeBotMove() {
        const botRes = game.makeMove(calculateNextMove(botBoard), bot);
        // artificial delay to make game feel more natural
        setTimeout(() => {
            setPlayerBoard(botRes.board);
            setCurrentPlayer(player);
        }, 1000);
    }

    function makeMove(p: IPoint) {
        if (currentPlayer === bot) {
            return;
        }
        const playerRes = game.makeMove(p, player);
        setBotBoard(playerRes.board);
        setCurrentPlayer(bot);

        makeBotMove();
    }

    useEffect(() => {
        if (currentPlayer === bot) {
            makeBotMove();
        }
    }, []);

    return (
        <Fragment>
            <GlobalStyle />
            <h3>{currentPlayer === player ? 'your turn' : 'wait'}</h3>
            <div style={{display: 'flex'}}>
                <Board board={playerBoard} ships={ships} />
                <Board board={botBoard} makeMove={makeMove} ships={null} />
            </div>
        </Fragment>
    );
};

export default OnePlayerGame;