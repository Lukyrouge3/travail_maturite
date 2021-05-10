import Long = require("long"); // Librairie nécessaire pour pouvoir gérér des nombre en 64bits parce que Javascript
// gère les nombres jusqu'à 55bits nativement.

export default class Bitboard {
    data: Long[] = [new Long(0), new Long(0)]; // L'index 0 contient les coups de l'IA et le 1 les coups du joueurs
    counter = 0; // Compte le nombre total de coups joués
    moves: number[] = []; // Retiens l'historiques des coups
    heights = [0, 7, 14, 21, 28, 35, 42]; // Retiens le "fill level" c'est à dire le nombre de bits à shifts pour chaque colonne
    static max_heights = [5, 12, 19, 26, 33, 40, 47]; // Stoque les hauteurs max de chaque colonne
    private static directions = [1, 6, 7, 8]; // Contiens les directions à check pour une victoire

    /**
     * Constructeur du bitboard
     * @param data Pour initialiser le bitboard à partir d'autre chose que 0
     */
    constructor(data?: Long[]) {
        if (data) this.data = data;
    }

    /**
     * Joue un coups sur la colonne donnée
     * Choisi automatiquement quel joueur à joué
     * Si counter est pair => c'est à l'odinatuer, sinon c'est au joueur
     * @param column
     * @return void
     */
    move(column: number): void {
        let move = new Long(1).shl(this.heights[column]); // On récupère la hauteur stockée dans heights avec la colonne
        // et on shift le 1 ce nombre de fois à gauche
        this.heights[column]++; // On incrémente la hauteur de la colonne
        this.data[this.counter & 1] = this.data[this.counter & 1].xor(move); // On joue le coup sur le board
        this.moves[this.counter++] = column; // On enregistre le coup
    }

    /**
     * Vérifie s'il n'y a pas une victoire sur le board désigné par l'index
     * @param index
     * @return boolean
     */
    isWin(index): boolean {
        let bb: Long;
        let board = this.data[index]; // On récupère le board avec son index
        for (let i = 0; i < Bitboard.directions.length; i++) { // Pour chaque direction on teste si 4 pièces sont alignées
            let direction = Bitboard.directions[i];
            bb = board.and((board.shr(direction)));                      // On teste la victoire
            if (!bb.and((bb.shr((2 * direction)))).isZero()) return true //
        }
        return false; // On retoune false par défaut
    }

    /**
     * Liste les coups possibles
     * @return number[] La liste des coups
     */
    listMoves(): number[] {
        let moves = [];
        for (let i = 0; i < this.heights.length; i++) {
            if (this.heights[i] <= Bitboard.max_heights[i]) moves.push(i); // On teste si un coup est possible ici
        }
        return moves;
    }

    /**
     * Crée une copie du bitboard (pour éviter les liens entre les arrays)
     * @return Bitboard
     */
    copy(): Bitboard {
        let board = new Bitboard();
        board.data = [...this.data];
        board.moves = [...this.moves];
        board.counter = this.counter;
        board.heights = [...this.heights];
        return board;
    }
}