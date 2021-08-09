import Hex from "./Hex";

export default class AntiHex extends Hex {
    constructor(width, height) {
        super(width, height);
    }
    move(r, c) {
        let gameOverBefore = this.gameOver;
        super.move(r, c);
        if (gameOverBefore != this.gameOver) {
            this.winner *= -1;
        }
    }
    copy() {
        let hex = new AntiHex(this.WIDTH, this.HEIGHT);
        hex.currentPlayer = this.currentPlayer;
        hex.gameOver = this.gameOver;
        hex.winner = this.winner;
        for (let move of this.moveHistory) {
            hex.board[move[0]][move[1]] = this.board[move[0]][move[1]];
            hex.moveHistory.push([...move]);
        }
        return hex;
    }
}