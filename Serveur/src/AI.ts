import * as fs from "fs";
import {parse, stringify} from 'flatted';
import Bitboard from "./Bitboard";

export default class AI {
    currentLeaf: Leaf;

    private ended = false;

    constructor() {
        // this.bitboards = [new Bitboard(), new Bitboard()];
        this.currentLeaf = new Leaf(new Bitboard(), 0);
    }

    generateTree(leaf: Leaf, depth, finalDepth) {
        leaf.computeChildrenV2();
        depth++;
        for (let i = 0; i < leaf.children.length; i++) {
            if (depth <= finalDepth) this.generateTree(leaf.children[i], depth, finalDepth);
        }
    }

    computeMove(): number {
        let ms = Date.now();
        this.currentLeaf._score = -42;
        this.generateTree(this.currentLeaf, 0, 1); // Max depth is 6 ~750ms
        this.currentLeaf.computeLeafScore(0);
        console.log(Date.now() - ms + "ms");
        return this.currentLeaf.getBestMove();
    }
}

class Leaf {
    // parent: Leaf;
    children: Leaf[] = [];
    board: Bitboard;
    counter = 0;
    _score: number = -42;

    constructor(board: Bitboard, count, parent?) {
        this.board = board;
        this.counter = count;
        // this.parent = parent;
    }

    move(col: number) {
        this.board.move(col);
        this.counter++;
    }

    computeChildrenV2() {
        let leaves: Leaf[] = [];
        let moves = this.board.listMoves();
        for (let j = 0; j < moves.length; j++) {
            let leaf = new Leaf(this.board.copy(), this.counter, this);
            leaf.move(moves[j]);
            leaves.push(leaf);
        }
        this.children = leaves;
    }

    updateScore(score: number) {
        if (score > this._score) {
            this._score = score;
            // if (this.parent) this.parent.updateScore(score);
        }
    }

    computeChildren() {
        let moves = this.board.listMoves();
        let leaves: Leaf[] = [];
        for (let j = 0; j < moves.length; j++) {
            let leaf = new Leaf(this.board.copy(), this.counter);
            leaf.move(moves[j]);
            leaves.push(leaf);
        }
        this.children = leaves;
    }

    computeLeafScore(count: number): number {
        let bestScore = -42;
        // this.counter++;
        if (this.board.isWin(0)) {
            bestScore = 42 - this.counter;
            console.log("WIN");
        } else if (this.board.isWin(1)) {
            bestScore = -42 + this.counter;
            console.log("WIN");
        } else if (this.children.length === 0) {
            bestScore = 0;
        }
        for (let i = 0; i < this.children.length; i++) {
            let score = -this.children[i].computeLeafScore(this.counter);
            if (score > bestScore) bestScore = score;
        }
        this._score = bestScore;
        return bestScore;
    }

    get forcedScore() {
        return this.computeLeafScore(0);
    }

    get score() {
        return this._score;
    }

    getBestMove(): number {
        console.log(this._score,
            this.children.length,
            this.board.moves, this.children.map(l => [l.score, l.children.map(m => m.score)]));
        let c = this.children[2].children[2];
        let bestChild = this.children.filter(l => l.score === this._score)[0];
        fs.writeFileSync("dist/aa.json", JSON.stringify(this));
        return bestChild.getLastMove();
    }

    getLastMove(): number {
        return this.board.moves[this.board.moves.length - 1];
    }
}