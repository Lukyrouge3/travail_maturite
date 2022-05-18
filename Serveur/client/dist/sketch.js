"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var p5_1 = __importDefault(require("p5"));
var connect4_1 = require("./connect4");
var socket_1 = __importDefault(require("./socket"));
var sketch = function (p5) {
    var containerDiv = document.getElementById("app");
    var connect4 = new connect4_1.Connect4(p5, containerDiv.offsetWidth, containerDiv.offsetWidth * 6 / 7);
    var socket = new socket_1["default"]();
    socket.on("setup", function (data) {
        connect4 = new connect4_1.Connect4(p5, containerDiv.offsetWidth, containerDiv.offsetWidth * 6 / 7);
        connect4.currentPlayer = data;
        updateInfos(connect4);
        socket.send("setupDone");
    });
    socket.on("move", function (data) {
        connect4.move(data);
        updateInfos(connect4);
    });
    socket.on("end", function (win) {
        connect4.isEnded = true;
        alert((win ? "Vous avez " : "L'ordinateur a ") + "gagné !\nPour recommencer, rechargez la page.");
        document.getElementById("currentTurn").innerHTML = "La partie est terminée ! " + (win ? "Vous avez <b>gagné</b> !" : "Vous avez <b>perdu</b> !");
    });
    p5.setup = function () {
        var canvas = p5.createCanvas(containerDiv.offsetWidth, containerDiv.offsetWidth * 6 / 7);
        canvas.parent("app");
    };
    p5.draw = function () {
        connect4.draw();
    };
    p5.mouseClicked = function () {
        if (connect4.currentPlayer == 0) {
            var click = connect4.click();
            if (click >= 0) {
                updateInfos(connect4);
                socket.send("move", click);
            }
        }
    };
};
function updateInfos(board) {
    var currentPlayer = document.getElementById("currentPlayer");
    currentPlayer.innerHTML = board.currentPlayer == 0 ? "Humain" : "Ordinateur";
    currentPlayer.classList.toggle("red");
    currentPlayer.classList.toggle("yellow");
}
new p5_1["default"](sketch);
//# sourceMappingURL=sketch.js.map