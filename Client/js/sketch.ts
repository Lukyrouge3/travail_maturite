import P5 from "p5";
import {Connect4} from "./connect4";
import Socket from "./socket";

let sketch = (p5: P5) => {
    let connect4 = new Connect4(p5);
    let containerDiv = document.getElementById("app");

    p5.setup = () => {
        let socket = new Socket();
        const canvas = p5.createCanvas(containerDiv.offsetWidth, containerDiv.offsetWidth);
        canvas.parent("app");
        socket.on("setup", data => {
            connect4.setup(p5.width / 8, data, socket);
            socket.send("setupDone", connect4.board);
        });
        socket.on("move", col => {
            connect4.move(col);
        });
        generateButton(p5, "Jouer un coup aléatoire", () => connect4.randomMove(), 800, 70);
        generateButton(p5, "Changer le string du board",
            () => connect4.changeString(prompt("Entrez le nouveau string", connect4.board)), 800, 40);
        generateButton(p5, "Réinitialiser le board", () => connect4.reset(), 800, 10);
        generateButton(p5, "Récupérer le string du board", () => alert(connect4.board), 800, 100);
    };

    p5.draw = () => {
        p5.background(255);
        if (connect4.ready) connect4.draw();
    };

    p5.mouseClicked = () => {
        connect4.mouseClicked(p5.mouseX, p5.mouseY);
    }
};

function generateButton(p5: P5, label: string, mousePressed: (() => void), x: number, y: number) {
    let button = p5.createButton(label);
    button.mousePressed(mousePressed);
    // button.position(x, y);
    button.parent("controls");
    button.addClass("button is-info");
    return button;
}

new P5(sketch);