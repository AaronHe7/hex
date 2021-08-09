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
        this.hex = hex;
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
        this.hex.move(...best.moveIndex);
        return best.select();
    }
    expand(games = 3) {
        if (this.children.length === this.childMoves.length) {
            for (let i = 0; i < games; i++) {
                this.backpropagate(this.simulate(games));
            }
            return;
        }
        let move = this.childMoves[this.children.length];
        let child = new Node(this.hex, this, move);
        this.children.push(child);
        if (child.status === Status.WIN) {
            this.status = Status.LOSS;
        }
        child.hex.move(...move);
        child.backpropagate(child.simulate(games));
        return child;
    }
    simulate(games) {
        // Stats: [blue wins, red wins]
        let stats = [0, 0];
        let moves = [...this.childMoves];
        while (games--) {
            console.log(this.hex.moveHistory.length);
            moves.shuffle();
            let winner;
            for (let i = 0; i <= moves.length; i++) {
                if (this.hex.gameOver) {
                    winner = this.hex.winner;
                    for (let j = 0; j < i; j++) {
                        this.hex.undo();
                    }
                    stats[(1 + winner) / 2]++;
                    break;
                }
                this.hex.move(...moves[i]);
            }
            console.log(this.hex.moveHistory.length);
        }
        return stats;
    }
    backpropagate(stats) {
        this.games++;
        this.hex.undo();
        if (this.parent !== undefined) {
            // Stats: [blue wins, red wins]
            this.wins += stats[(1 + this.parent.hex.currentPlayer) / 2];
            this.parent.backpropagate(stats);
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