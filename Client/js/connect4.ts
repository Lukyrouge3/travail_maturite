import P5 from "p5";
import Socket from "./socket";

export class Connect4 {
    static WIDTH = 7; // La largeur du board
    static HEIGHT = 6; // La hauteur du board
    static RADIUS = 50; // Le rayon des pièces

    static YELLOW_COLOR = "rgb(255, 255, 60)";
    static RED_COLOR = "rgb(255, 60, 60)";
    static BOARD_COLOR = "rgb(100, 100, 255)";
    static EMPTY_COLOR = "rgb(224,224,224)";
    static EMPTY_BOARD: string = "7/7/7/7/7/7";

    currentPlayer: string; // Le charactère du joueur à qui c'est le tour de jouer (soit p soit P)
    board: string; // Représente le board sous la form d'un string
    isEnded: boolean = false; // Savoir si la partie est terminée
    ready: boolean = false;

    p5: P5; // L'instance de p5js
    socket: Socket;

    constructor(p5: P5) {
        this.p5 = p5;
    }

    /**
     *  Setup le board
     */
    setup(diameter: number, currentPlayer: string, socket: Socket): void {
        this.board = Connect4.EMPTY_BOARD; // Etat initial du board
        Connect4.RADIUS = diameter/2;
        this.currentPlayer = currentPlayer;
        this.ready = true;
        this.socket = socket;
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
        this.p5.fill(0);
        this.p5.textSize(30);
        if (!this.isEnded) this.p5.text("C'est " + (this.currentPlayer === "p" ? "au joueur" : "à l'ordiateur") + " de jouer !",
            100, Connect4.RADIUS * (2 * lines.length - 1) + 100);
        else this.p5.text("L" + (this.currentPlayer === "p" ? "'ordinateur" : "e joueur") + " à gagné !",
            100, Connect4.RADIUS * (2 * lines.length - 1) + 100);
    }

    /**
     * Test si s est un nombre
     * @param s
     */
    static isNumeric(s: any): boolean {
        return !isNaN(s - parseFloat(s));
    }

    /**
     * Gère un click
     * @param x
     * @param y
     */
    mouseClicked(x: number, y: number): void {
        let col = Math.floor(x / (Connect4.RADIUS * 2)); // On calcule la colonne cliquée en fonction de x
        if (x <= Connect4.RADIUS * 2 * Connect4.WIDTH && y <= Connect4.RADIUS * 2 * Connect4.HEIGHT) // On ne veux que des clics à l'intérieur de la grille
            this.move(col);
    }

    /**
     * Créer un array 2d à partir d'un string
     * L'array est sous la forme (y, x)
     * @param b
     */
    static toBoardArray(b: string): string[][] {
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

    /**
     * Essaye de faire jouer un coup au currentPlayer
     * @param col
     */
    move(col: number): boolean {
        if (this.isEnded) return true;
        // Passons du board (string) à une représentation en 2d du board
        let board = Connect4.toBoardArray(this.board);

        // On essaye de placer le coup ligne par ligne (de bas en haut)
        for (let i = 0; i < board.length; i++) {
            if (board[i][col] === "") { // Place libre
                board[i][col] = this.currentPlayer; // On insère le coup
                this.board = Connect4.boardArrayToString(board); // On re-génère le string du board
                if (this.checkWin(board, col, i, this.currentPlayer) // On vérifie si personne n'a gagné
                    || this.checkDraw(board)) { // On vérifie si le bord n'est pas plein
                    this.isEnded = true;
                }
                this.currentPlayer = this.currentPlayer === "p" ? "P" : "p"; // On swap le currentPlayer
                // (par gain de perf on passe directement le board 2d pour ne pas avoir à le re-générer)
                if (this.currentPlayer === "P") this.socket.send("move", col);
                return true;
            }
        }
        // Coup impossible par manque de place
        return false;
    }

    /**
     * Créer un string représentant le board à partir d'un array
     * @param board
     */
    private static boardArrayToString(board: any[]): string {
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

    /**
     *  On teste si le dernier coup joué à terminé la partie.
     * @param board
     * @param last_x
     * @param last_y
     * @param last_player
     * @return boolean
     */
    checkWin(board: string[][], last_x: number, last_y: number, last_player: string): boolean {
        // Horizontale
        let lHor = 0, rHor = 0; // On crée 2 variables qui nous serviront à compter le nombre de pièces horizontales à gauche (lHor) et à droite (rHor)
        while (board[last_y][last_x - lHor] === last_player) {
            lHor++;
            if (last_x - lHor < 0) break; // On ne veut pas chercher en dehors du tableau.
        }
        while (board[last_y][last_x + rHor] === last_player) {
            rHor++;
            if (last_x + rHor >= board.length) break;
        }
        if (lHor + rHor - 1 >= 4) return true; // Si la somme des deux horizontales est plus grande que 4 (en retirant 1 pièces que l'on compte 2 fois) alors le joueur à gagné.
        // Verticale
        let ver = 0;
        if (last_y > 2) {
            while (board[last_y - ver][last_x] === last_player) {
                ver++;
                if (last_y - ver < 0) break;
            }
        }
        // console.log(ver, last_y + ver, board.length, board, board[last_y - ver][last_x]);
        if (ver >= 4) return true;
        // Diagonales
        let lDiag1 = 0, rDiag1 = 0;
        while (board[last_y - lDiag1][last_x - lDiag1] === last_player) {
            lDiag1++;
            if (last_x - lDiag1 < 0 || last_y - lDiag1 < 0) break;
        }
        while (board[last_y + rDiag1][last_x + rDiag1] === last_player) {
            rDiag1++;
            if (last_y + rDiag1 >= board.length || last_x + rDiag1 >= board[last_y + rDiag1].length) break;
        }
        if (lDiag1 + rDiag1 - 1 >= 4) return true;
        let lDiag2 = 0, rDiag2 = 0;
        while (board[last_y + lDiag2][last_x - lDiag2] === last_player) {
            lDiag2++;
            if (last_x - lDiag2 < 0 || last_y + lDiag2 >= board.length) break;
        }
        while (board[last_y - rDiag2][last_x + rDiag2] === last_player) {
            rDiag2++;
            if (last_y - rDiag2 < 0 || last_x + rDiag2 >= board[last_y - rDiag2].length) break;
        }
        if (lDiag2 + rDiag2 - 1 >= 4) return true;
        return false;
    }

    /**
     * Vérifie si le board est plein et donc la partie est nulle.
     * @param board
     */
    checkDraw(board: string[][]): boolean {
        for (let i = 0; i < board[Connect4.HEIGHT - 1].length; i++) {
            if (board[Connect4.HEIGHT - 1][i] === "") return false;
        }
        return true;
    }

    /**
     * Reset le board
     */
    reset(): void {
        this.board = Connect4.EMPTY_BOARD;
        this.currentPlayer = Connect4.pickRandomFirstPlayer();
        this.isEnded = false;
    }

    /**
     * Pick un joueur aléatoire
     */
    private static pickRandomFirstPlayer(): string {
        return Math.floor(Math.random() * 50) < 50 ? "p" : "P";
    }

    /**
     * Fonction pour mettre le board dans une position précise
     * @param str
     */
    changeString(str: string): void {
        if (str === "" || str === null) str = Connect4.EMPTY_BOARD;
        this.board = str;
        this.currentPlayer = this.board.split("p").length < this.board.split("P").length ? "p" : "P";
        this.isEnded = this.checkBoardWin();
    }

    /**
     * Va check tout le board pour vérifier que personne n'a gagné
     * Utile notamment quand on change le board de force avec le sring
     */
    checkBoardWin() {
        let b = Connect4.toBoardArray(this.board);
        if (this.checkDraw(b)) return true;
        for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < b[i].length; j++) {
                if (this.checkWin(b, j, i, this.currentPlayer === "p" ? "P" : "p")) return true;
            }
        }
        return false;
    }

    randomMove() {
        let b;
        do b = this.move(Math.floor(Math.random() * 7)); while (!b);
    }
}