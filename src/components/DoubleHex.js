import Hex from "./Hex";

export default class DoubleHex extends Hex {
    constructor(width, height) {
        super(width, height);
        this.moves = 0;
    }
    move(r, c) {
        let taken = !super.move(r, c);
        if (taken) return;
        this.currentPlayer *= -1;
        this.moves++;
        if (this.moves === 2 || this.moveHistory.length === 1) {
            this.moves = 0;
            this.currentPlayer *= -1;
        }
    }
    copy() {
        let hex = new DoubleHex(this.WIDTH, this.HEIGHT);
        hex.currentPlayer = this.currentPlayer;
        hex.gameOver = this.gameOver;
        hex.winner = this.winner;
        hex.moves = this.moves;
        for (let move of this.moveHistory) {
            hex.board[move[0]][move[1]] = this.board[move[0]][move[1]];
            hex.moveHistory.push([...move]);
        }
        return hex;
    }
    undo() {
        let move = this.moveHistory.pop();
        if (move) {
            this.moves--;
            if (this.moves < 0) {
                this.moves = 1;
                if (this.moveHistory.length === 1) {
                    this.moves = 0;
                }
                this.currentPlayer *= -1;
            }
            this.gameOver = false;
            this.winner = 0;
            this.board[move[0]][move[1]] = 0;
        }
    }
}