import AI from "./AI";

const cliProgress = require("cli-progress");

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const gameCount = 200;


const players = [
    (ai, maxing = false) => ai.random(ai.board),
    (ai, maxing = false) => ai.minimax(ai.board, 5, 0, maxing),
    (ai, maxing = false) => ai.alphaBeta(ai.board, 5, 5, -Infinity, Infinity, maxing),
    (ai, maxing = false) => ai.alphaBeta(ai.board, 8, 8, -Infinity, Infinity, maxing),
    (ai, maxing = false) => ai.alphaBeta(ai.board, 8, 8, -Infinity, Infinity, maxing, true)
];

const players_name = ["random", "minimax", "AB5", "AB8", "AB8+H"];


// for (let i = 0; i<players.length; i++) {
//     for (let j = 0; j < players.length; j++) {
let i = 4, j = 3;
bar.start(gameCount, 0);
let ply1 = players[i];
let ply2 = players[j];
let c1 = 0, c2 = 0, t = 0, rnd;
for (let a = 0; a < gameCount; a++) {
    let ai = new AI();
    rnd = Math.floor(Math.random() * 2);
    while (!ai.board.isWin(0) && !ai.board.isWin(1) && ai.board.listMoves().length != 0) {
        ai.node_map.clear();
        let move;
        if (rnd == 0) {
            move = !(ai.board.counter & 1) ? ply1(ai, true) : ply2(ai, false);
        } else {
            move = (ai.board.counter & 1) ? ply1(ai, false) : ply2(ai, true);
        }
        ai.board.move(move);
    }
    if (ai.board.isWin(rnd)) c1++;
    else if (ai.board.isWin((rnd + 1) % 2)) c2++;
    else t++;
    bar.increment();
}
bar.stop();
console.log(`Player1 (${players_name[i]}): ${c1}, Player2 (${players_name[j]}): ${c2}, Ties: ${t}, WR: ${c1 / (gameCount) * 100}`);
//     }
// }