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

    isWin(index) {
        let bb;
        let bitboard = this.data[index];
        // for (let i = 0; i < Bitboard.directions.length; i++) {
        //     let direction = Bitboard.directions[i];
        //     bb = bitboard & (bitboard >> direction);
        //     if ((bb & (bb >> (2 * direction))) != 0) return true
        // }
        // return false;
        let m = bitboard & (bitboard >> 7)
        if (m & (m >> 14)) return true

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

    toString() {
        let str = "[";
        for (let i = 0; i < this.data.length; i++) {
            let d = this.data[i];
            let dstr = '0'.repeat(42 - d.toString(2).length) + d.toString(2);
            let l = dstr.length;
            for (let j = 0; j < l; j += 7) {
                dstr = dstr.substring(0, j) + "\n" + dstr.substring(j, dstr.length);
            }
            str += dstr + ",";
        }
        return str + "]";
    }
}