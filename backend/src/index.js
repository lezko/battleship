const ws = require('ws');
const {stringify} = require('nodemon/lib/utils');
const {Game, generateBoard, rand, getOpponent} = require('shared');
const wss = new ws.WebSocketServer({
    port: 5000,

}, () => console.log('server started...'));

const ships = [];
let gameStarted = false;
let game;
let currentPlayer = rand(0, 2);
const players = [];
wss.on('connection', ws => {
    // ws.on('create', () => {
    //
    // })
    // ws.on('join', () => {
    //
    // })
    ws.on('message', str => {
        const data = JSON.parse(str);
        console.log(data);
        switch (data.event) {
            case 'ready':
                if (gameStarted) {
                    return;
                }
                ships.push(data.ships);
                players.push(ws);
                if (ships.length === 2) {
                    gameStarted = true;
                    game = new Game(ships, [generateBoard(), generateBoard()]);
                    broadcast();
                }
                break;
            case 'move':
                const p = data.point;
                const player = players.indexOf(ws);
                game.makeMove(p, player);
                currentPlayer = getOpponent(currentPlayer);
                players[player].send(JSON.stringify({
                    currentPlayer,
                    previousPlayer: getOpponent(currentPlayer),
                    ships: [],
                    board: game.getBoard(currentPlayer),
                }));
                players[currentPlayer].send(JSON.stringify({
                    currentPlayer,
                    previousPlayer: getOpponent(currentPlayer),
                    ships: game.getShips(currentPlayer),
                    board: game.getBoard(currentPlayer),
                }));
                break;

        }
    });

    ws.on('ready', (string) => {
        const data = JSON.parse(string);
        console.log(1);
        console.log(data);
    });
});

function broadcast() {
    for (let i = 0; i < 2; i++) {
        players[i].send(JSON.stringify({
            board: generateBoard(),
            previousPlayer: currentPlayer,
            currentPlayer,
            ships: []
        }));
    }
    // wss.clients.forEach(c => {
    //     c.send(JSON.stringify({
    //         board: generateBoard(),
    //         ships
    //     }));
    // });
}