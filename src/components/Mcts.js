import Hex from './Hex'

Array.prototype.shuffle = function () {
    for (let i = 0; i < this.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
}

var Status = { WIN: 1, LOSS: -1, INDETERMINATE: 0 }

class Node {
    constructor(hex, parent = undefined, moveIndex = undefined) {
        this.parent = parent;
        this.wins = 0;
        this.games = 0;
        this.moveIndex = moveIndex;
        this.hex = hex.copy();
        this.childMoves = [];
        this.children = [];
        this.status = Status.INDETERMINATE;
        if (hex.gameOver) {
            // It is a win for the parent
            this.status = Status.WIN;
        }
        if (!this.hex.gameOver) {
            for (let i = 0; i < this.hex.HEIGHT; i++) {
                for (let j = 0; j < this.hex.WIDTH; j++) {
                    if (this.hex.board[i][j] === 0) {
                        this.childMoves.push([i, j]);
                    }
                }
            }
            this.childMoves.shuffle();
        }
    }
    isLeaf() {
        return this.childMoves.length === 0;
    }
    evaluate() {
        if (this.status == Status.INDETERMINATE) {
            return this.wins / this.games + Math.sqrt(Math.log(this.parent.games) / this.games);
        }
        return Infinity * this.status;
    }
    select() {
        if (this.children.length === 0 || this.children.length < this.childMoves.length)
            return this;
        let best = this.children[0];
        for (let child of this.children) {
            if (child.evaluate() > best.evaluate()) {
                best = child;
            }
        }
        return best.select();
    }
    expand(games = 3) {
        if (this.children.length === this.childMoves.length) {
            for (let i = 0; i < games; i++) {
                this.backpropagate(this.simulate());
            }
            return;
        }
        let move = this.childMoves[this.children.length];
        let childHex = this.hex.copy();
        childHex.move(...move);
        let child = new Node(childHex, this, move);
        this.children.push(child);
        if (child.status === Status.WIN) {
            this.status = Status.LOSS;
        }
        for (let i = 0; i < games; i++) {
            child.backpropagate(child.simulate());
        }
        return child;
    }
    simulate() {
        let moves = [...this.childMoves];
        let copyHex = this.hex.copy();
        moves.shuffle();
        for (let move of moves) {
            if (copyHex.gameOver) break;
            copyHex.move(...move);
        }
        return copyHex.winner;
    }
    backpropagate(winner) {
        this.games++;
        if (this.parent !== undefined) {
            this.wins += winner === this.parent.hex.currentPlayer;
            this.parent.backpropagate(winner);
        }
    }
}

export default class Mcts {
    constructor(hex) {
        this.hex = hex;
        this.rootNode = new Node(hex);
    }
    bestMove(simulations = 4000) {
        if (this.rootNode.gameOver) {
            return;
        }
        while (simulations--) {
            let node = this.rootNode.select();
            node.expand();
        }
        let bestChild = this.rootNode.children[0];
        for (let child of this.rootNode.children) {
            if (child.games > bestChild.games) {
                bestChild = child;
            }
        }
        console.log(this.rootNode);
        return bestChild.moveIndex;
    }
    move() {
        let move = this.bestMove();
        this.hex.move(...move);
    }
}