export default class RandomPlayer {
    constructor(hex) {
        this.hex = hex;
    }
    move() {
        let moves = [];
        let board;
        if (this.hex.view) {
            board = this.hex.view[this.hex.currentPlayer];
        } else {
            board = this.hex.board;
        }
        for (let i = 0; i < this.hex.HEIGHT; i++) {
            for (let j = 0; j < this.hex.WIDTH; j++) {
                if (!board[i][j]) {
                    moves.push([i, j])
                }
            }
        }
        if (!moves.length) return;
        // cloning move by move avg ~750ms
        this.hex.move(...moves[Math.floor(Math.random() * moves.length)]);
    }
}
