import P5 from "p5";
import {Connect4} from "./connect4";

let sketch = (p5: P5) => {
    let connect4 = new Connect4(p5);
    let resetButton;
    let stringButton;
    let randomMoveButton;
    let getStringButton;

    p5.setup = () => {
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
        connect4.setup();

        resetButton = p5.createButton("Réinitialiser le board");
        resetButton.mousePressed(() => connect4.reset());
        resetButton.position(800, 10);

        stringButton = p5.createButton("Changer le string du board");
        stringButton.mousePressed(() => connect4.changeString(prompt("Entrez le nouveau string (à vos risques et périls)", connect4.board)));
        stringButton.position(800, 40);

        randomMoveButton = p5.createButton("Jouer un coup aléatoire");
        randomMoveButton.mousePressed(() => {
            let b;
            do b = connect4.move(Math.floor(Math.random() * 7));
            while (!b);
        });
        randomMoveButton.position(800, 70);

        getStringButton = p5.createButton("Récupérer le string du board");
        getStringButton.mousePressed(() => alert(connect4.board));
        getStringButton.position(800, 100);
    };

    p5.draw = () => {
        p5.background(255);
        connect4.draw();
    };
    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };

    p5.mouseClicked = () => {
        connect4.mouseClicked(p5.mouseX, p5.mouseY);
    }
};

new P5(sketch);