import P5 from "p5";
import {Connect4} from "./connect4";
import Socket from "./socket";

let sketch = (p5: P5) => {
    let containerDiv = document.getElementById("app");
    let connect4 = new Connect4(p5, containerDiv.offsetWidth, containerDiv.offsetWidth * 6 / 7);
    let socket = new Socket();

    socket.on("setup", data => {
        connect4 = new Connect4(p5, containerDiv.offsetWidth, containerDiv.offsetWidth * 6 / 7);
        connect4.currentPlayer = data;
        updateInfos(connect4);
        socket.send("setupDone");
    });

    socket.on("move", data => {
        connect4.move(data);
        updateInfos(connect4);
    });

    socket.on("end", win => {
        connect4.isEnded = true;
        alert((win ? "Vous avez " : "L'ordinateur a ") + "gagné !\nPour recommencer, rechargez la page.");
        document.getElementById("currentTurn").innerHTML = "La partie est terminée ! " + (win ? "Vous avez <b>gagné</b> !" : "Vous avez <b>perdu</b> !");
    })

    p5.setup = () => {
        const canvas = p5.createCanvas(containerDiv.offsetWidth, containerDiv.offsetWidth * 6 / 7);
        canvas.parent("app");
    }
    p5.draw = () => {
        connect4.draw();
    }
    p5.mouseClicked = () => {
        if (connect4.currentPlayer == 0) {
            let click = connect4.click();
            if (click >= 0) {
                updateInfos(connect4);
                socket.send("move", click);
            }
        }
    }
};

function updateInfos(board: Connect4) {
    let currentPlayer = document.getElementById("currentPlayer");
    currentPlayer.innerHTML = board.currentPlayer == 0 ? "Humain" : "Ordinateur";
    currentPlayer.classList.toggle("red");
    currentPlayer.classList.toggle("yellow");
}

new P5(sketch);