export default class randomPlayer {
    constructor(hex) {
        this.hex = hex;
    }
    move() {
        let moves = [];
        for (let i = 0; i < this.hex.HEIGHT; i++) {
            for (let j = 0; j < this.hex.WIDTH; j++) {
                if (!this.hex.board[i][j]) {
                    moves.push([i, j])
                }
            }
        }
        if (!moves.length) return;
        this.hex.move(...moves[Math.floor(Math.random() * moves.length)]);
    }
}
