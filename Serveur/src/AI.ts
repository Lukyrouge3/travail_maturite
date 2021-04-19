export default class AI {
    private bitboards: number[];
    private counter = 0;
    private moves: number[];
    private heights = [0, 7, 14, 21, 28, 35, 42];
    private static directions = [1, 6, 7, 8];
    private static TOP = 0b1000000_1000000_1000000_1000000_1000000_1000000_1000000;

    constructor() {
        this.bitboards = new Array(2);
        this.moves = new Array(42);
    }

    // https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md

    move(column: number) {
        let move = 1 << this.heights[column];
        this.heights[column]++;
        this.bitboards[this.counter & 1] ^= move;
        this.moves[this.counter++] = move;
    }

    undoMove() {
        let column = this.moves[this.counter--];
        let move = 1 << this.heights[column];
        this.heights[column]--;
        this.bitboards[this.counter & 1] ^= move;
    }

    isWin(bitboard: number) {
        for (let i = 0; i < AI.directions.length; i++) {
            let direction = AI.directions[i];
            if ((bitboard & (bitboard >> direction)
                & (bitboard >> (2 * direction))
                & (bitboard >> (3 * direction))) != 0)
                return true
        }
        return false;
    }

    listMoves(): number[] {
        let moves = [];
        for (let col = 0; col <= 6; col++) {
            if ((AI.TOP & (1 << this.heights[col])) == 0)
                moves.push(col);
        }
        return moves;
    }

    static isNumeric(s: any): boolean {
        return !isNaN(s - parseFloat(s));
    }

    static fromBoardString(b: string): AI {
        let ai = new AI();
        let lines = b.split("/"); // On récupère chaque ligne du board
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[i].length; j++) {
                let char = lines[i][j];
                if (!AI.isNumeric(char)) {
                    ai.move(j);
                }
            }
        }
        return ai;
    }

    computeMove(): number {
        let possibleMoves = this.listMoves();
        for (let i = 0; i < possibleMoves.length; i++) {
            let m = possibleMoves[i];
            this.move(m);
            if (this.isWin(this.bitboards[this.counter & 0])) return m;
            else this.undoMove();
        }
        return -1;
    }
}