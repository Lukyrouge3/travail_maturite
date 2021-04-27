export default class Bitboard {
    data = [0, 0];
    counter = 0;
    moves: number[];
    heights = [0, 7, 14, 21, 28, 35, 42];
    private static directions = [1, 6, 7, 8];
    private static TOP = 0b1000000_1000000_1000000_1000000_1000000_1000000_1000000;

    // https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md

    constructor(data?) {
        this.moves = [];
        if (data) this.data = data;
    }

    move(column: number) {
        let move = 1 << this.heights[column];
        this.heights[column]++;
        this.data[this.counter & 1] ^= move;
        this.moves[this.counter++] = column;
    }

    undoMove() {
        let column = this.moves[--this.counter];
        this.heights[column]--;
        let move = 1 << this.heights[column];
        this.data[this.counter & 1] ^= move;
    }

    isWin(bitboard) {
        for (let i = 0; i < Bitboard.directions.length; i++) {
            let direction = Bitboard.directions[i];
            if ((this.data[bitboard] & (this.data[bitboard] >> direction)
                & (this.data[bitboard] >> (2 * direction))
                & (this.data[bitboard] >> (3 * direction))) != 0)
                return true
        }
        return false;
    }

    listMoves(): number[] {
        let moves = [];
        for (let col = 0; col <= 6; col++) {
            if ((Bitboard.TOP & (1 << this.heights[col])) == 0)
                moves.push(col);
        }
        return moves;
    }

    static isNumeric(s: any): boolean {
        return !isNaN(s - parseFloat(s));
    }

    copy(): Bitboard {
        let board = new Bitboard();
        board.data = [...this.data];
        board.moves = [...this.moves];
        board.counter = this.counter;
        board.heights = [...this.heights];
        return board;
    }
}