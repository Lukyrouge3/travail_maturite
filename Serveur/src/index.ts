import {Server} from "socket.io";
import {createServer} from "http";
import * as fs from "fs";
import AI from "./AI";

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
    let currentPlayer = 0;
    let ai1 = new AI();
    ai1.max_depth = 8;
    let ai2 = new AI();
    socket.emit("setup", currentPlayer); // On ordonne au client de se setup
    socket.on("setupDone", () => { // Une fois le setup terminé, on joue un coups si c'est le tour de l'odinateur
        let move = Math.floor(Math.random() * 7);
        ai1.board.move(move);
        socket.emit("move", move);
    });
    socket.on("move", col => { // Lorsqu'on recoit un coup, on le joue sur l'IA et on envoie le coup de l'IA
        ai1.board.move(col);
        // ai2.board.move(col);
        move();
    });

    /**
     * Calcule et joue le coup de l'IA
     */
    function move() {
        ai1.node_map.clear();
        let move = ai1.alphaBeta(ai1.board);
        ai1.board.move(move);
        socket.emit("move", move);
    }
});

httpServer.listen(1234); // On lance le serveur http

