import * as fs from "fs";

export default class AI {
    currentLeaf: Leaf;

    private ended = false;

    constructor() {
        // this.bitboards = [new Bitboard(), new Bitboard()];
        this.currentLeaf = new Leaf([new Bitboard(0), new Bitboard(0)], 0);
    }

    generateTree(leaf: Leaf, depth, finalDepth) {
        leaf.computeChildren();
        depth++;
        for (let i = 0; i < leaf.children.length; i++) {
            if (depth <= finalDepth) this.generateTree(leaf.children[i], depth, finalDepth);
        }
    }

    computeMove(): number {
        let ms = Date.now();
        this.generateTree(this.currentLeaf, 0, 6); // Max depth is 6 ~750ms
        console.log(Date.now() - ms + "ms");
        return this.currentLeaf.getBestMove();
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
    // parent: Leaf;
    children: Leaf[] = [];
    boards: Bitboard[];
    counter = 0;
    _score: number;

    constructor(boards: Bitboard[], count) {
        this.boards = boards;
        this.counter = count;
    }

    move(col: number) {
        this.boards[this.counter & 1].move(col);
        this.counter++;
    }

    computeChildren() {
        let moves = this.boards[this.counter & 1].listMoves();
        let leaves: Leaf[] = [];
        for (let j = 0; j < moves.length; j++) {
            let leaf = new Leaf(this.boards.map(b => b.copy()), this.counter);
            leaf.move(moves[j]);
            leaves.push(leaf);
        }
        this.children = leaves;
    }

    computeLeafScore(count: number): number {
        let score = -42;
        count++;
        if (this.boards[this.counter & 0].isWin()) {
            this._score = 42 - this.counter;
            return 42 - count;
        }
        if (this.children.length === 0) {
            this._score = 0;
            return 0;
        }
        for (let i = 0; i < this.children.length; i++) {
            score = Math.max((this.counter & 1 ? -1 : 1) * this.children[i].computeLeafScore(count), score);
        }
        this._score = count & 1 ? score : -score;
        return score;
    }

    get forcedScore() {
        return this.computeLeafScore(0);
    }

    get score() {
        if (!this._score) this.computeLeafScore(0);
        return this._score;
    }

    getBestMove(): number {
        console.log(this.forcedScore, this.children.length, this.children.map(l => l.score));
        let bestChild = this.children.filter(l => l.score === this.forcedScore)[0];
        fs.writeFileSync("a.json", JSON.stringify(this));
        return bestChild.getLastMove();
    }

    getLastMove(): number {
        return this.boards[this.counter - 1 & 1].moves[this.boards[this.counter & 0].moves.length - 1];
    }
}