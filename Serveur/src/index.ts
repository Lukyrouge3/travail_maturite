import Bitboard from "./Bitboard";

require('dotenv').config();

import {Server} from "socket.io";
import {createServer} from "http";
import * as fs from "fs";
import AI from "./AI";

const requestListener = (req, res) => { // On initializer un petit serveur http simplement pour servir
    // les quelques fichiers nécessaires
    if (req.url === "/") req.url = "/index2.html";
    if (req.url === "/favicon.ico") return;
    let type = "";
    switch (req.url.split(".")[1]) {
        case "html":
            type = "text/html";
            break;
        case "scss":
        case "css":
            type = "text/css";
            break;
        case "js":
            type = "application/javascript";
            break;
    }
    try {
        let f = fs.readFileSync("./client" + req.url, {});
        res.setHeader("Content-Type", type);
        res.writeHead(200);
        res.end(f);
    } catch (err) {
        console.log(err);
    }
};

const httpServer = createServer(requestListener);
const io = new Server(httpServer); // On crée le WebSocket

io.on("connection", socket => {  // Lors de la connection d'un nouveau socket :
    let startingPlayer = Math.round(Math.random());
    let ai = new AI();
    ai.max_depth = 9;
    socket.emit("setup", startingPlayer); // On ordonne au client de se setup
    socket.on("setupDone", () => { // Une fois le setup terminé, on joue un coups si c'est le tour de l'odinateur
        if (startingPlayer) move();
    });
    socket.on("move", col => { // Lorsqu'on recoit un coup, on le joue sur l'IA et on envoie le coup de l'IA
        ai.board.move(col);
        move();
    });

    /**
     * Calcule et joue le coup de l'IA
     */
    function move() {
        let m;
        if (ai.board.moves.length <= 1) {
            m = Math.floor(Math.random() * 7);
            ai.board.move(m);
            socket.emit("move", m);
        } else {
            ai.node_map.clear();
            m = ai.alphaBeta(ai.board, startingPlayer == 1 ? 0 : 1, ai.max_depth, -Infinity, Infinity, true);
            ai.board.move(m);
            socket.emit("move", m);
        }
        if (ai.board.isWin(0) || ai.board.isWin(1)) {
            socket.emit("end", ai.board.isWin(startingPlayer));
        }
    }
});


httpServer.listen(process.env.PORT); // On lance le serveur http