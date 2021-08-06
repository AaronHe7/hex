import React, { Component } from 'react'
import Hex from './Hex'
import styles from './css/game.module.scss'
import randomPlayer from './randomPlayer'


export default class Game extends Component {
    constructor(props) {
        super(props)
        this.canvasRef = React.createRef();
        this.statusRef = React.createRef();
        this.statusRef2 = React.createRef();
        this.heightRef = React.createRef();
        this.widthRef = React.createRef();
        this.redRef = React.createRef();
        this.blueRef = React.createRef();
    }
    isInteger(s) {
        for (let i = 0; i < s.length; i++) {
            if (!"0123456789".includes(s[i])) {
                return false;
            }
        }
        return s.length > 0 && parseInt(s) !== 0;
    }
    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        this.WHITE = [255, 255, 255];
        this.BLACK = [0, 0, 0];
        this.RED = [255, 0, 0];
        this.BLUE = [0, 0, 255];
        this.interval = setInterval(() => {
            this.update()
            this.draw()
        }, 1000 / 30);
        let _this = this;
        this.canvas.addEventListener('click', function (e) {
            const rect = _this.canvas.getBoundingClientRect();
            const ratioX = _this.canvas.width / rect.width;
            const ratioY = _this.canvas.height / rect.height;
            const x = ratioX * (e.clientX - rect.left);
            const y = ratioY * (e.clientY - rect.top);
            _this.mousePressed(x, y)
        })
    }
    startGame() {
        if (!this.isInteger(this.heightRef.current.value) || !this.isInteger(this.widthRef.current.value)) {
            return;
        }
        this.aiRed = this.redRef.current.value;
        this.aiBlue = this.blueRef.current.value;
        let height = parseInt(this.heightRef.current.value);
        let width = parseInt(this.widthRef.current.value);
        this.hex = new Hex(height, width);
        this.hexagons = new Array(this.hex.HEIGHT);
        this.cellSize = 80;
        for (let i = 0; i < this.hex.HEIGHT; i++) {
            this.hexagons[i] = new Array(this.hex.WIDTH);
            for (let j = 0; j < this.hex.WIDTH; j++) {
                this.hexagons[i][j] = [];
                let center = this.getCenter(i, j);
                for (let k = 0; k < 6; k++) {
                    let angle = k * Math.PI / 3 + Math.PI / 2;
                    this.hexagons[i][j].push([center[0] + this.cellSize * Math.cos(angle), center[1] - this.cellSize * Math.sin(angle)]);
                }
            }
        }
    }
    getCenter(row, col) {
        let s60 = Math.sin(Math.PI / 3);
        let x = this.cellSize * 1.5 + row * this.cellSize * s60 + col * 2 * this.cellSize * s60;
        let y = this.cellSize * 1.5 + row * this.cellSize * 3 / 2;
        return [x, y];
    }
    drawCell(row, col) {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        let points = this.hexagons[row][col];
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            this.ctx.moveTo(...points[i]);
            this.ctx.lineTo(...points[(i + 1) % 6]);
        }
        this.ctx.stroke();
        this.ctx.lineWidth = 5;
        for (let i = 0; i < 6; i++) {
            let coords = [[points[i][0], points[i][1]], [points[(i + 1) % 6][0], points[(i + 1) % 6][1]]];
            let top = row === 0 && (i === 0 || i === 5);
            let bottom = row === this.hex.HEIGHT - 1 && (i === 2 || i === 3);
            let left = col === 0 && (i === 1 || i === 2);
            let right = col === this.hex.WIDTH - 1 && (i === 4 || i === 5);
            if (top || bottom) {
                this.ctx.strokeStyle = "red";
                this.ctx.beginPath();
                this.ctx.moveTo(...coords[0]);
                this.ctx.lineTo(...coords[1]);
                this.ctx.stroke();
            }
            if (left || right) {
                this.ctx.strokeStyle = "blue";
                this.ctx.beginPath();
                this.ctx.moveTo(...coords[0]);
                this.ctx.lineTo(...coords[1]);
                this.ctx.stroke();
            }
        }
    }
    draw() {
        if (!this.hex) return;
        this.ctx.fillStyle = "white";
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fill();
        for (let i = 0; i < this.hex.HEIGHT; i++) {
            for (let j = 0; j < this.hex.WIDTH; j++) {
                this.ctx.fillStyle = "white";
                this.drawCell(i, j);
                let center = this.getCenter(i, j);
                let color;
                switch (this.hex.board[i][j]) {
                    case 1:
                        color = "red";
                        break;
                    case -1:
                        color = "blue";
                        break;
                }
                if (color) {
                    this.ctx.strokeStyle = "black"
                    this.ctx.lineWidth = 5;
                    this.ctx.beginPath();
                    this.ctx.arc(...center, this.cellSize / 2, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                }
            }
        }
    }
    update() {
        let status = this.statusRef.current;
        let status2 = this.statusRef2.current;
        if (!this.hex) {
            status.textContent = status2.textContent = "";
            return;
        }
        this.move();
        return;
        if (!this.hex.gameOver) {
            status.textContent = `${this.hex.currentPlayer > 0 ? "Red" : "Blue"}`
            status2.textContent = "'s Turn";
            if (this.hex.currentPlayer > 0) {
                status.classList.remove(styles.blue);
                status.classList.add(styles.red);
            } else {
                status.classList.remove(styles.red);
                status.classList.add(styles.blue);
            }
        } else {
            status.textContent = `${this.hex.winner > 0 ? "Red" : "Blue"}`
            status2.textContent = " Wins";
        }
    }
    move() {
        if (this.hex.gameOver) return;
        let playerString = this.hex.currentPlayer == 1 ? this.aiRed : this.aiBlue;
        let player;
        if (playerString === "manual") return;
        switch (playerString) {
            case "random":
                player = new randomPlayer(this.hex);
                break;
        }
        console.log(playerString);
        player.move();
    }
    getCell(x, y) {
        for (let i = 0; i < this.hex.HEIGHT; i++) {
            for (let j = 0; j < this.hex.WIDTH; j++) {
                let center = this.getCenter(i, j);
                if ((x - center[0]) ** 2 + (y - center[1]) ** 2 <= 3 / 4 * this.cellSize ** 2) {
                    return [i, j];
                }
            }
        }
    }
    mousePressed(x, y) {
        let cellCoords = this.getCell(x, y);
        if (cellCoords === undefined) return;
        this.hex.move(...cellCoords);
    }
    render() {
        return (
            <div class={styles.container}>
                <div class={styles.controls}>
                    <label for="height">Height:</label>
                    <input type="number" min="1" name="height" id="height" ref={this.heightRef} value="6" />
                    <label for="width">Width:</label>
                    <input type="number" min="1" name="width" id="width" ref={this.widthRef} value="6" />
                    <br />
                    <label for="red">Red:</label>
                    <select name="red" id="red" ref={this.redRef}>
                        <option value="manual">Manual</option>
                        <option value="random">Random</option>
                        {/* <option value="mcts">MCTS</option> */}
                    </select>
                    <br />
                    <label for="blue">Blue:</label>
                    <select name="blue" id="blue" ref={this.blueRef}>
                        <option value="manual">Manual</option>
                        <option value="random">Random</option>
                        {/* <option value="mcts">MCTS</option> */}
                    </select>
                    <br />
                    <button onClick={() => this.startGame()}>Start game</button>
                </div>
                <div class={styles.game}>
                    <span ref={this.statusRef} className={styles.status}></span>
                    <span ref={this.statusRef2} className={styles.status}></span>
                    <br />
                    <canvas ref={this.canvasRef} width="2400" height="1600" style={{ width: "60vw" }}></canvas>
                </div >
            </div>
        )
    }
}
