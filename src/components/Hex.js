import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Hex {
    constructor(height = 11, width = 11) {
        this.WIDTH = height;
        this.HEIGHT = width;
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
        if (!this.inBound(r, c) || this.board[r][c] !== this.currentPlayer) {
            return false;
        }
        if (f(r, c)) {
            return true;
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
        return r <= 0;
    }
    connectBottom(r, c) {
        return r >= this.HEIGHT - 1;
    }
    connectLeft(r, c) {
        return c <= 0;
    }
    connectRight(r, c) {
        return c >= this.WIDTH - 1;
    }
    findWin(r, c) {
        let f1, f2;
        // red connects top and bottom
        if (this.currentPlayer > 0) {
            f1 = (r, c) => this.connectTop(r, c);
            f2 = (r, c) => this.connectBottom(r, c);
        } else {
            f1 = (r, c) => this.connectLeft(r, c);
            f2 = (r, c) => this.connectRight(r, c);
        }
        let connect1 = this.findConnection(r, c, f1);
        let connect2 = this.findConnection(r, c, f2);
        return connect1 && connect2;
    }
}
