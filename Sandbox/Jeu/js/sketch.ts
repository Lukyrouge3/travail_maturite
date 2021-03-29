import P5 from "p5";
import {Connect4} from "./connect4";

let sketch = (p5: P5) => {
    let connect4 = new Connect4(p5);

    p5.setup = () => {
        const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);

        connect4.setup();
    };

    p5.draw = () => {
        // p5.background(0);
        connect4.draw();
    };
    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };

    p5.mouseClicked = () => {
        connect4.mouseClicked(p5.mouseX);
    }
};

new P5(sketch);