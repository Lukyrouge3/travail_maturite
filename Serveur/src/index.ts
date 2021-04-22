import {Server} from "socket.io";
import {createServer} from "http";
import * as fs from "fs";
import AI from "./AI";

const requestListener = (req, res) => {
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
const io = new Server(httpServer);

io.on("connection", socket => {
    let currentPlayer = Math.random() < .5 ? "p" : "P";
    let ai = new AI();
    socket.emit("setup", currentPlayer);
    socket.on("setupDone", data => {
        // AI.fromBoardString(data);
        move();
    });
    socket.on("updateBoard", data => {
        // AI.fromBoardString(data);
        currentPlayer = data.currentPlayer;
        move();
    });

    function move() {
        // if (currentPlayer === "P")
        // Play a move
        // socket.emit("move", ai.computeMove());
    }
});


httpServer.listen(1234);

let ai = new AI();
console.log(ai.computeMove());