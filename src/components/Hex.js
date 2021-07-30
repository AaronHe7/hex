import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Hex {
    constructor() {
        this.WIDTH = 11;
        this.HEIGHT = 11;
        this.currentPlayer = 1;
        this.gameOver = false;
        this.winner = 0;
        // 0 empty 1 red, -1 blue
        this.board = new Array(this.HEIGHT);
        // for the dfs function, marks whether cell has been searched
        this.searched = new Array(this.HEIGHT);
        // list of all cells that have been searched
        this.searchedQueue = [];
        for (let i = 0; i < this.HEIGHT; i++) {
            this.board[i] = new Array(this.WIDTH).fill(0);
            this.searched[i] = new Array(this.WIDTH).fill(false);
        }
    }
    move(r, c) {
        if (this.board[r][c] !== 0 || this.gameOver || !this.inBound(r, c)) {
            return false;
        }
        this.board[r][c] = this.currentPlayer;
        if (this.findWin(r, c)) {
            this.winner = this.currentPlayer;
            this.gameOver = true;
        }
        this.currentPlayer *= -1;
    }
    findConnection(r, c, f) {
        let result = this.dfs(r, c, f);
        for (let cell of this.searchedQueue) {
            this.searched[cell[0]][cell[1]] = false;
        }
        this.searchedQueue = [];
        return result;
    }
    dfs(r, c, f) {
        if (f(r, c)) {
            return true;
        }
        if (!this.inBound(r, c) || this.board[r][c] != this.currentPlayer) {
            return false;
        }
        let found = false;
        let neighbors = this.neighbors(r, c);
        this.searched[r][c] = true;
        this.searchedQueue.push([r, c]);
        for (let neighbor of neighbors) {
            if (this.inBound(...neighbor) && !this.searched[neighbor[0]][neighbor[1]]) {
                if (this.dfs(...neighbor, f)) {
                    found = true;
                    break;
                }
            }
        }
        return found;
    }
    inBound(r, c) {
        return r >= 0 && c >= 0 && r < this.HEIGHT && c < this.WIDTH;
    }
    neighbors(r, c) {
        return [[r - 1, c], [r - 1, c + 1], [r, c + 1], [r + 1, c], [r + 1, c - 1], [r, c - 1]]
    }
    connectTop(r, c) {
        return r < 0;
    }
    connectBottom(r, c) {
        return r >= this.HEIGHT;
    }
    connectLeft(r, c) {
        return c < 0;
    }
    connectRight(r, c) {
        return c >= this.WIDTH;
    }
    findWin(r, c) {
        let f1, f2;
        // red connects top and bottom
        if (this.currentPlayer > 0) {
            f1 = this.connectTop;
            f2 = this.connectBottom;
        } else {
            f1 = this.connectLeft;
            f2 = this.connectRight;
        }
        return this.findConnection(r, c, f1) && this.findConnection(r, c, f2);
    }
}
