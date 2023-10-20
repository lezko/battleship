import {getFromLocalStorage} from 'utils/localStorage';
import {Board, Player, Point, Ship} from 'shared';

export enum Connection {
    Create = 0, Join = 1
}

export interface MoveResult {
    board: Board;
    ships: Ship[];
    previousPlayer: Player;
    currentPlayer: Player;
}

export class OnlineGameClient {
    private socket: WebSocket;

    constructor(ships: Ship[], onMove: (res: MoveResult) => void) {
        const url = getFromLocalStorage('wsUrl') as string;
        if (url === null) {
            throw new Error('ws url not found in localStorage');
        }
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            this.socket.send(JSON.stringify({
                // event: connection === Connection.Create ? 'create' : 'join',
                event: 'ready',
                ships
            }));
        }
        this.socket.onmessage = e => {
            const data = JSON.parse(e.data);
            onMove({
                board: data.board,
                ships: data.ships,
                currentPlayer: data.currentPlayer,
                previousPlayer: data.previousPlayer
            });
        };
    }

    public makeMove(p: Point) {
        this.socket.send(JSON.stringify({
            event: 'move',
            point: p,
        }));
    }
}