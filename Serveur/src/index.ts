import {Server} from "socket.io";
import {createServer} from "http";
import * as fs from "fs";
import AI from "./AI";
import Bitboard from "./Bitboard";

const requestListener = (req, res) => { // On initializer un petit serveur http simplement pour servir
    // les quelques fichiers nécessaires
    if (req.url === "/") req.url = "/index.html";
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
    let f = fs.readFileSync("../Client" + req.url, {});
    res.setHeader("Content-Type", type);
    res.writeHead(200);
    res.end(f);
};

const httpServer = createServer(requestListener);
const io = new Server(httpServer); // On crée le WebSocket

io.on("connection", socket => {  // Lors de la connection d'un nouveau socket :
    let currentPlayer = "P";
    let ai = new AI();
    socket.emit("setup", currentPlayer); // On ordonne au client de se setup
    socket.on("setupDone", () => { // Une fois le setup terminé, on joue un coups si c'est le tour de l'odinateur
        if (currentPlayer === "P")
            move();
    });
    socket.on("move", col => { // Lorsqu'on recoit un coup, on le joue sur l'IA et on envoie le coup de l'IA
        ai.board.move(col);
        move();
    });

    /**
     * Calcule et joue le coup de l'IA
     */
    function move() {
        let col = ai.alphaBetaPruning(ai.board, 0, -99, 99, true); // On calcule le meilleur coup
        ai.board.move(col); // On l'enregistre
        socket.emit("move", col); // On l'envoie
    }
});

httpServer.listen(1234); // On lance le serveur http

