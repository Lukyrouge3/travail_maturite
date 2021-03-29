import P5 from "p5";

export class Connect4 {
    static WIDTH = 7; // La largeur du board
    static HEIGHT = 6; // La hauteur du board
    static RADIUS = 50; // Le rayon des pièces

    static YELLOW_COLOR = "rgb(255, 255, 60)";
    static RED_COLOR = "rgb(255, 60, 60)";
    static BOARD_COLOR = "rgb(100, 100, 255)";

    currentPlayer: string; // L'index du joueur à qui c'est le tour de jouer
    board: string; // Représente le board sous la form d'un string

    p5: P5; // L'instance de p5js

    constructor(p5) {
        this.p5 = p5;
    }

    /**
     *  Setup le board
     */
    setup(): void {
        this.board = "7/7/7/7/7/7"; // Etat initial du board
    }

    /**
     * Dessine le board
     * Appelé à chaque frame
     */
    draw(): void {
        this.p5.noStroke(); // On enlève les contours des objets
        this.p5.fill(Connect4.BOARD_COLOR);
        this.p5.rect(0, 0, Connect4.WIDTH * Connect4.RADIUS * 2, Connect4.HEIGHT * Connect4.RADIUS * 2);
        let lines = this.board.split("/"); // On récupère chaque ligne du board
        for (let l = lines.length - 1; l >= 0; l--) { // On boucle pour chaque ligne (de haut en bas)
            for (let line = 0; line < lines[l].length; line++) { // On boucle chaque char de la ligne
                let char = lines[l][line];
                if (char === "p") this.p5.fill(Connect4.RED_COLOR); // On met rouge si c'est le joueur 1
                else if (char === "P") this.p5.fill(Connect4.YELLOW_COLOR); // On met jaune si c'est le joueur 2
                if (Connect4.isNumeric(char)) { // Si c'est un nombre cela correspond à un nombre de cases vides
                    this.p5.fill(200); // On met en gris pour une case vide
                    for (let j = 0; j < parseInt(char); j++) {
                        this.p5.ellipse(Connect4.RADIUS * (2 * (line + j) + 1),
                            Connect4.RADIUS * (2 * (lines.length - l - 1) + 1), Connect4.RADIUS * 2);
                        // On dessine la case
                    }
                } else this.p5.ellipse(Connect4.RADIUS * (2 * line + 1),
                    Connect4.RADIUS * (2 * (lines.length - l - 1) + 1), Connect4.RADIUS * 2);
                // Si ce n'est pas une case vide on dessine une pièce.
            }
        }
    }

    static isNumeric(s) {
        return !isNaN(s - parseFloat(s));
    }
}