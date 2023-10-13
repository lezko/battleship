import Board from 'components/Board';
import {generateBoard} from 'core/generateBoard';
import {generateRandomShipArrangement} from 'core/bot/generateRandomShipArrangement';
import {Fragment, useState} from 'react';
import GlobalStyle from 'GlobalStyle';
import {calculateNextMove} from 'core/bot/calculateNextMove';
import {CellState} from 'core/types/CellState';

const App = () => {
    const [board, setBoard] = useState(generateBoard());
    const [ships, setShips] = useState(generateRandomShipArrangement());

    return (
        <Fragment>
            <GlobalStyle />
            <Board board={board} ships={ships} />
            <button onClick={() => {
                const p = calculateNextMove(board);
                console.log(p);
                const nextBoard = board.slice();
                let shipHit = false;
                for (const ship of ships) {
                    for (let i = ship.position.start.row; i <= ship.position.end.row; i++) {
                        for (let j = ship.position.start.col; j <= ship.position.end.col; j++) {
                            if (i === p.row && j === p.col && board[i][j] !== CellState.Hit) {
                                ship.decksHit++;
                                nextBoard[i][j] = ship.decksHit < ship.size ? CellState.Hit : CellState.Sunk;
                                shipHit = true;
                                break;
                            }
                        }
                        if (shipHit) {
                            break;
                        }
                    }
                    if (shipHit) {
                        break;
                    }
                }
                if (!shipHit) {
                    nextBoard[p.row][p.col] = CellState.Miss;
                }
                setBoard(nextBoard);
            }}>shoot
            </button>
        </Fragment>
    );
};

export default App;