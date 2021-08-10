import Hex from "./Hex";
export default class DarkHex extends Hex {
    constructor(width, height) {
        super(width, height);
        this.view = [];
        this.view[-1] = new Array(height);
        this.view[1] = new Array(height);
        for (let i = 0; i < height; i++) {
            this.view[-1][i] = new Array(width).fill(0);
            this.view[1][i] = new Array(width).fill(0);
        }
    }
    copy() {
        let hex = new Hex(this.WIDTH, this.HEIGHT);
        hex.currentPlayer = this.currentPlayer;
        hex.gameOver = this.gameOver;
        hex.winner = this.winner;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                hex.board[i][j] = this.view[this.currentPlayer][i][j];
            }
        }
        return hex;
    }
    move(r, c) {
        if (this.gameOver || !this.inBound(r, c)) {
            return;
        }
        let taken = !super.move(r, c);
        if (!taken) {
            this.currentPlayer *= -1;
        }
        this.view[this.currentPlayer][r][c] = this.board[r][c];
        if (!taken) {
            this.currentPlayer *= -1;
        }
    }
}