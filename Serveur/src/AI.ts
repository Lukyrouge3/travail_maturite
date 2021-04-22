export default class AI {
    private bitboards: Bitboard[];

    private ended = false;

    constructor() {
        this.bitboards = [new Bitboard(), new Bitboard()];
    }

    generateTree(leaf: Leaf, depth, finalDepth) {
        leaf.computeChildren([0, 1, 2, 3, 4, 5, 6]);
        depth++;
        for (let i = 0; i < leaf.children.length; i++) {
            if (depth <= finalDepth) this.generateTree(leaf.children[i], depth, finalDepth);
        }
    }

    computeMove(): number {
        let ms = Date.now();
        let leaf = new Leaf(new Bitboard(0));
        this.generateTree(leaf, 0, 4); // Max depth is 6 ~750ms
        console.log(leaf.score);
        console.log(Date.now() - ms + "ms");
        return 0;
    }
}

class Bitboard {
    data = 0;
    counter = 0;
    moves: number[];
    heights = [0, 7, 14, 21, 28, 35, 42];
    private static directions = [1, 6, 7, 8];
    private static TOP = 0b1000000_1000000_1000000_1000000_1000000_1000000_1000000;

    // https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md

    constructor(data?) {
        this.moves = [];
        this.data = data;
    }

    move(column: number) {
        let move = 1 << this.heights[column];
        this.heights[column]++;
        this.data ^= move;
        this.moves[this.counter++] = column;
    }

    undoMove() {
        let column = this.moves[--this.counter];
        this.heights[column]--;
        let move = 1 << this.heights[column];
        this.data ^= move;
    }

    isWin() {
        // let bitboard = this.bitboards[this.counter & 0];
        // console.log(bitboard.toString(2));
        for (let i = 0; i < Bitboard.directions.length; i++) {
            let direction = Bitboard.directions[i];
            if ((this.data & (this.data >> direction)
                & (this.data >> (2 * direction))
                & (this.data >> (3 * direction))) != 0)
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

    // static fromBoardString(b: string): AI {
    //     let ai = new AI();
    //     let lines = b.split("/"); // On récupère chaque ligne du board
    //     for (let i = 0; i < lines.length; i++) {
    //         for (let j = 0; j < lines[i].length; j++) {
    //             let char = lines[i][j];
    //             if (!Bitboard.isNumeric(char)) {
    //                 ai.move(j);
    //             }
    //         }
    //     }
    //     return ai;
    // }

    isWinningMove(col: number): boolean {
        let win;
        this.move(col);
        win = this.isWin();
        this.undoMove();
        return win;
    }

    copy(): Bitboard {
        let board = new Bitboard();
        board.data = this.data;
        board.moves = [...this.moves];
        board.counter = this.counter;
        board.heights = [...this.heights];
        return board;
    }
}

class Leaf {
    parent: Leaf;
    children: Leaf[] = [];
    board: Bitboard;
    _score: number;

    constructor(board: Bitboard, parent?) {
        this.board = board;
        this.parent = parent;
    }

    computeChildren(moves: number[]) {
        let leaves: Leaf[] = [];
        for (let j = 0; j < moves.length; j++) {
            let leaf = new Leaf(this.board.copy(), this);
            leaf.board.move(moves[j]);
            leaves.push(leaf);
        }
        this.children = leaves;
    }

    computeLeafScore(count: number): number {
        let score = -42;
        count++;
        for (let i = 0; i < this.children.length; i++) {
            if (this.board.isWin()) return 42 - count / 2;
            score = Math.max(score, this.children[i].computeLeafScore(count));
        }
        return score;
    }

    get score() {
        if (!this._score) this.computeLeafScore(0);
        return this._score;
    }
}