"use strict";
exports.__esModule = true;
exports.Connect4 = void 0;
var Connect4 = /** @class */ (function () {
    function Connect4(p5, width, height) {
        this.currentPlayer = 0;
        this.data = [];
        this.isEnded = false;
        this.p5 = p5;
        this.columns = [];
        for (var i = 0; i < 7; i++)
            this.columns.push(new Column(this.p5, i * width / 7, 0, width / 7, height));
        Connect4.Singleton = this;
    }
    Connect4.prototype.clear = function () {
        this.data = [];
    };
    Connect4.prototype.draw = function () {
        this.p5.fill(30);
        this.p5.rect(0, 0, this.p5.width, this.p5.height);
        this.p5.stroke(255);
        this.p5.strokeWeight(2);
        for (var i = 1; i < 7; i++) {
            this.p5.line(0, i * this.p5.height / 6, this.p5.width, i * this.p5.height / 6);
        }
        this.columns.forEach(function (c) { return c.draw(); });
    };
    Connect4.prototype.click = function () {
        var n = -1;
        if (this.isEnded)
            return n;
        this.columns.forEach(function (c, k) {
            var col = c.click();
            if (col)
                n = k;
        });
        return n;
    };
    Connect4.prototype.move = function (col) {
        if (this.isEnded)
            return false;
        return this.columns[col].move();
    };
    Connect4.RADIUS = 50; // Le rayon des pièces
    Connect4.YELLOW_COLOR = "rgb(255, 255, 60)";
    Connect4.RED_COLOR = "rgb(255, 60, 60)";
    return Connect4;
}());
exports.Connect4 = Connect4;
var Column = /** @class */ (function () {
    function Column(p5, x, y, width, height) {
        this.hovered = false;
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.piecesHeight = height;
        this.pieces = [];
    }
    Column.prototype.draw = function () {
        this.hovered = this.p5.mouseX >= this.x && this.p5.mouseX <= (this.x + this.width) &&
            this.p5.mouseY >= this.y && this.p5.mouseY <= (this.y + this.height);
        this.pieces.forEach(function (p) { return p.draw(); });
        if (this.hovered)
            this.p5.fill(255, 255, 255, 40);
        else
            this.p5.noFill();
        this.p5.stroke(255);
        this.p5.strokeWeight(2);
        this.p5.rect(this.x, this.y, this.width, this.height);
    };
    Column.prototype.move = function () {
        if (this.piecesHeight < 0)
            return false;
        this.pieces.push(new Piece(this.p5, this.x, this.piecesHeight, this.width, Connect4.Singleton.currentPlayer ? this.p5.color(Connect4.RED_COLOR) : this.p5.color(Connect4.YELLOW_COLOR)));
        Connect4.Singleton.currentPlayer = Connect4.Singleton.currentPlayer ? 0 : 1;
        this.piecesHeight -= Piece.radius;
        return true;
    };
    Column.prototype.click = function () {
        if (this.hovered)
            return this.move();
        return false;
    };
    return Column;
}());
var Piece = /** @class */ (function () {
    function Piece(p5, x, height, radius, color) {
        this.y = 0;
        this.speed = 0;
        this.p5 = p5;
        this.x = x;
        this.height = height;
        Piece.radius = radius;
        this.color = color;
        this.speed = 0;
        this.velocity = 1;
    }
    Piece.prototype.draw = function () {
        this.speed += this.velocity;
        this.y += this.speed;
        if (this.y >= this.height - Piece.radius / 2) {
            this.y = this.height - Piece.radius / 2;
            this.speed = -this.speed / 1.9;
            if (this.speed == 0)
                this.velocity = 0;
        }
        this.p5.fill(this.color);
        this.p5.noStroke();
        this.p5.ellipse(this.x + Piece.radius / 2, this.y, Piece.radius, Piece.radius);
    };
    Piece.radius = 50;
    return Piece;
}());
//# sourceMappingURL=connect4.js.map