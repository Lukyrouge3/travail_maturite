import P5 from "p5";

export class Connect4 {
    static WIDTH = 7; // La largeur du board
    static HEIGHT = 6; // La hauteur du board
    static RADIUS = 50; // Le rayon des pièces

    static YELLOW_COLOR = "rgb(255, 255, 60)";
    static RED_COLOR = "rgb(255, 60, 60)";
    static BOARD_COLOR = "rgb(100, 100, 255)";
    static EMPTY_COLOR = "rgb(224,224,224)";

    currentPlayer: string; // L'index du joueur à qui c'est le tour de jouer
    board: string; // Représente le board sous la form d'un string

    p5: P5; // L'instance de p5js

    constructor(p5: P5) {
        this.p5 = p5;
    }

    /**
     *  Setup le board
     */
    setup(): void {
        this.board = "7/7/7/7/7/7"; // Etat initial du board
        this.currentPlayer = Math.floor(Math.random() * 50) < 50 ? "p" : "P";
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
            for (let line = 0, index = 0; line < lines[l].length; line++, index++) { // On boucle chaque char de la ligne
                let char = lines[l][line];
                if (char === "p") this.p5.fill(Connect4.RED_COLOR); // On met rouge si c'est le joueur 1
                else if (char === "P") this.p5.fill(Connect4.YELLOW_COLOR); // On met jaune si c'est le joueur 2
                if (Connect4.isNumeric(char)) { // Si c'est un nombre cela correspond à un nombre de cases vides
                    this.p5.fill(Connect4.EMPTY_COLOR); // On met en gris pour une case vide
                    for (let j = 0; j < parseInt(char); j++) {
                        this.p5.ellipse(Connect4.RADIUS * (2 * (index + j) + 1),
                            Connect4.RADIUS * (2 * (lines.length - l - 1) + 1), Connect4.RADIUS * 2);
                        // On dessine la case
                    }
                    index += parseInt(char) - 1;
                } else this.p5.ellipse(Connect4.RADIUS * (2 * index + 1),
                    Connect4.RADIUS * (2 * (lines.length - l - 1) + 1), Connect4.RADIUS * 2);
                // Si ce n'est pas une case vide on dessine une pièce.
            }
        }
    }

    static isNumeric(s: any) {
        return !isNaN(s - parseFloat(s));
    }

    mouseClicked(x: number): void {
        let col = Math.floor(x / (Connect4.RADIUS * 2)); // On calcule la colonne cliquée en fonction de x
        this.move(col);
    }

    static toBoardArray(b: string) {
        let board = [];
        let lines = b.split("/"); // On récupère chaque ligne du board
        for (let i = 0; i < lines.length; i++) {
            board.push([]);
            for (let j = 0; j < lines[i].length; j++) {
                let char = lines[i][j];
                // board[i].push(char);
                if (Connect4.isNumeric(char)) {
                    for (let k = 0; k < parseInt(char); k++) board[i].push('');
                } else board[i].push(char);
            }
        }
        return board;
    }

    move(col: number) {
        // Passons du board (string) à une représentation en 2d du board
        let board = Connect4.toBoardArray(this.board);

        // On essaye de placer le coup ligne par ligne (de bas en haut)
        for (let i = 0; i < board.length; i++) {
            if (board[i][col] === "") { // Place libre
                board[i][col] = this.currentPlayer; // On insère le coup
                this.board = Connect4.boardArrayToString(board); // On re-génère le string du board
                this.currentPlayer = this.currentPlayer === "p" ? "P" : "p"; // On swap le currentPlayer
                this.checkWin(board); // On vérifie si personne n'a gagné
                // (par gain de perf on passe directement le board 2d pour ne pas avoir à le re-générer)
                return true;
            }
        }
        // Coup impossible par manque de place
        return false;
    }

    private static boardArrayToString(board: any[]) {
        let str = "";
        let count = 0; // On initialize un compteur pour les cases vides
        for (let i = 0; i < board.length; i++) { // On boucle sur tout le tableau
            for (let j = 0; j < board[i].length; j++) {
                let char = board[i][j];
                if (char === "") { // Si le char est vide ==> case vide on incrémente le compteur
                    count++;
                } else {
                    if (count > 0) { // Le compteur n'est pas vide ==> on insère le nombre de case vide
                        str += count;
                        count = 0; // On réinitialise le compteur
                    }
                    str += board[i][j]; // On insère le char
                }
            }
            if (count > 0) { // A la fin de chaque ligne on insère le compteur s'il n'est pas vide et on le réinitialise
                str += count;
                count = 0;
            }
            str += "/"; // A la fin de chaque ligne on met un "/" pour les séparer
        }
        return str.substr(0, str.length - 1); // On retourne le string sans le dernier "/"
    }

    checkWin(board) {
        //TODO Implement
    }
}