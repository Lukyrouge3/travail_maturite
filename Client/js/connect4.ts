import P5 from "p5";

export class Connect4 {
    static RADIUS = 50; // Le rayon des pièces

    static YELLOW_COLOR = "rgb(255, 255, 60)";
    static RED_COLOR = "rgb(255, 60, 60)";
    public static Singleton: Connect4;
    public currentPlayer: number = 0;
    private p5: P5;
    private data: number[][] = [];
    private columns: Column[];

    public isEnded = false;

    constructor(p5: P5, width, height) {
        this.p5 = p5;
        this.columns = [];
        for (let i = 0; i < 7; i++) this.columns.push(new Column(this.p5, i * width / 7, 0, width / 7, height));
        Connect4.Singleton = this;
    }

    clear(): void {
        this.data = [];
    }

    draw() {
        this.p5.fill(30);
        this.p5.rect(0, 0, this.p5.width, this.p5.height);
        this.p5.stroke(255);
        this.p5.strokeWeight(2);
        for (let i = 1; i < 7; i++) {
            this.p5.line(0, i * this.p5.height / 6, this.p5.width, i * this.p5.height / 6);
        }
        this.columns.forEach(c => c.draw());
    }

    click(): number {
        let n = -1;
        if (this.isEnded) return n;
        this.columns.forEach((c, k) => {
            let col = c.click();
            if (col) n = k;
        });
        return n;
    }

    move(col): boolean {
        if (this.isEnded) return false;
        return this.columns[col].move();
    }
}

class Column {
    private p5: P5;
    private hovered = false;
    private readonly x: number;
    private readonly y: number;
    private readonly width: number;
    private readonly height: number;
    private piecesHeight: number;

    private pieces: Piece[];

    constructor(p5: P5, x: number, y: number, width: number, height: number) {
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.piecesHeight = height;
        this.pieces = [];
    }

    draw() {
        this.hovered = this.p5.mouseX >= this.x && this.p5.mouseX <= (this.x + this.width) &&
            this.p5.mouseY >= this.y && this.p5.mouseY <= (this.y + this.height);
        this.pieces.forEach(p => p.draw());
        if (this.hovered) this.p5.fill(255, 255, 255, 40);
        else this.p5.noFill();
        this.p5.stroke(255);
        this.p5.strokeWeight(2);
        this.p5.rect(this.x, this.y, this.width, this.height);
    }

    move(): boolean {
        if (this.piecesHeight < 0) return false;
        this.pieces.push(new Piece(this.p5, this.x, this.piecesHeight, this.width,
            Connect4.Singleton.currentPlayer ? this.p5.color(Connect4.RED_COLOR) : this.p5.color(Connect4.YELLOW_COLOR)));
        Connect4.Singleton.currentPlayer = Connect4.Singleton.currentPlayer ? 0 : 1;
        this.piecesHeight -= Piece.radius;
        return true;
    }

    click(): boolean {
        if (this.hovered) return this.move();
        return false;
    }
}

class Piece {
    public static radius: number = 50;
    private p5: P5;
    private x: number;
    private y = 0;
    private speed = 0;
    private velocity: number;
    private height: number;
    private color: P5.Color;

    constructor(p5: P5, x: number, height: number, radius: number, color: P5.Color) {
        this.p5 = p5;
        this.x = x;
        this.height = height;
        Piece.radius = radius;
        this.color = color;

        this.speed = 0;
        this.velocity = 1;
    }

    draw() {
        this.speed += this.velocity;
        this.y += this.speed;

        if (this.y >= this.height - Piece.radius / 2) {
            this.y = this.height - Piece.radius / 2;
            this.speed = -this.speed / 1.9;
            if (this.speed == 0) this.velocity = 0;
        }

        this.p5.fill(this.color);
        this.p5.noStroke();
        this.p5.ellipse(this.x + Piece.radius / 2, this.y, Piece.radius, Piece.radius);
    }
}