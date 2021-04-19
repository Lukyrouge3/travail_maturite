export default class AI {
    private bitboards: number[];
    private counter = 0;
    private moves: number[];
    private heights = [0, 7, 14, 21, 28, 35, 42];
    private static directions = [1, 6, 7, 8];
    private static TOP = 0b1000000_1000000_1000000_1000000_1000000_1000000_1000000;

    private ended = false;

    constructor() {
        this.bitboards = [0, 0];
        this.moves = new Array(42);
    }

    // https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md

    move(column: number) {
        let move = 1 << this.heights[column];
        this.heights[column]++;
        this.bitboards[this.counter & 1] ^= move;
        this.moves[this.counter++] = column;
    }

    undoMove() {
        let column = this.moves[--this.counter];
        this.heights[column]--;
        let move = 1 << this.heights[column];
        this.bitboards[this.counter & 1] ^= move;
    }

    isWin(bitboard) {
        // let bitboard = this.bitboards[this.counter & 0];
        // console.log(bitboard.toString(2));
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

    isWinningMove(col: number): boolean {
        let win;
        this.move(col);
        win = this.isWin(this.bitboards[this.counter & 0]);
        this.undoMove();
        return win;
    }

    minimax() {
        if (!this.ended) {
            let moveList = this.listMoves();
            for (let x = 0; x < moveList.length; x++) {
                if (this.isWinningMove(moveList[x])) {
                    console.log("WIN FOUND");
                    this.move(moveList[x]);
                    this.ended = true;
                    return 43 - this.moves.length / 2;
                }
            }

            let bestScore = -42;

            for (let x = 0; x < moveList.length; x++) {
                this.move(moveList[x]);
                let score = -this.minimax();
                if (score > bestScore) {
                    bestScore = score;
                } else this.undoMove();
            }
            console.log("bestScore", bestScore);
            return bestScore;
        }
    }

    computeMove(): number {
        let max = this.minimax();
        console.log(this.moves);
        return max;
    }
}