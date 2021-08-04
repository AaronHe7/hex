import { render } from '@testing-library/react'
import p5 from 'p5';
import React, { Component } from 'react'
import Hex from './Hex'


export default class Game extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef();
    }
    sketch(p) {
        p.hex = new Hex();
        p.WHITE = [255, 255, 255];
        p.BLACK = [0, 0, 0];
        p.RED = [255, 0, 0];
        p.BLUE = [0, 0, 255];
        p.hexagons = new Array(p.hex.HEIGHT);
        p.cellSize = 40;
        p.setup = function () {
            p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.8);
            for (let i = 0; i < p.hex.HEIGHT; i++) {
                p.hexagons[i] = new Array(p.hex.WIDTH);
                for (let j = 0; j < p.hex.WIDTH; j++) {
                    p.hexagons[i][j] = [];
                    let center = p.getCenter(i, j);
                    for (let k = 0; k < 6; k++) {
                        let angle = k * Math.PI / 3 + Math.PI / 2;
                        p.hexagons[i][j].push([center[0] + p.cellSize * Math.cos(angle), center[1] - p.cellSize * Math.sin(angle)]);
                    }
                }
            }
        }
        p.getCenter = function (row, col) {
            let s60 = Math.sin(Math.PI / 3);
            let x = p.cellSize * 1.5 + row * p.cellSize * s60 + col * 2 * p.cellSize * s60;
            let y = p.cellSize * 1.5 + row * p.cellSize * 3 / 2;
            return [x, y];
        }
        p.drawCell = function (row, col) {
            p.stroke(p.BLACK);
            p.strokeWeight(2);
            let points = p.hexagons[row][col];
            p.beginShape();
            for (let i = 0; i < 6; i++) {
                p.vertex(...points[i]);
            }
            p.endShape(p.CLOSE);
            p.strokeWeight(5);
            for (let i = 0; i < 6; i++) {
                let coords = [points[i][0], points[i][1], points[(i + 1) % 6][0], points[(i + 1) % 6][1]];
                let top = row === 0 && (i === 0 || i === 5);
                let bottom = row === p.hex.HEIGHT - 1 && (i === 2 || i === 3);
                let left = col === 0 && (i === 1 || i === 2);
                let right = col === p.hex.WIDTH - 1 && (i === 4 || i === 5);
                if (top || bottom) {
                    p.stroke(p.RED);
                    p.line(...coords);
                }
                if (left || right) {
                    p.stroke(p.BLUE);
                    p.line(...coords);
                }
            }
        }
        p.draw = function () {
            p.background(255);
            p.stroke(100);
            for (let i = 0; i < p.hex.HEIGHT; i++) {
                for (let j = 0; j < p.hex.WIDTH; j++) {
                    p.fill(p.WHITE);
                    p.drawCell(i, j);
                    let center = p.getCenter(i, j);
                    let color;
                    switch (p.hex.board[i][j]) {
                        case 1:
                            color = p.RED;
                            break;
                        case -1:
                            color = p.BLUE;
                            break;
                    }
                    if (color) {
                        p.stroke(p.BLACK);
                        p.strokeWeight(4);
                        p.fill(color);
                        p.circle(...center, p.cellSize);
                    }
                }
            }
        }
        p.getCell = function (x, y) {
            for (let i = 0; i < p.hex.HEIGHT; i++) {
                for (let j = 0; j < p.hex.WIDTH; j++) {
                    let center = p.getCenter(i, j);
                    if ((x - center[0]) ** 2 + (y - center[1]) ** 2 <= p.cellSize ** 2) {
                        return [i, j];
                    }
                }
            }
        }
        p.mousePressed = function () {
            let cellCoords = p.getCell(p.mouseX, p.mouseY);
            if (cellCoords === undefined) return;
            p.hex.move(...cellCoords);
        }
    }
    componentDidMount() {
        let _this = this;
        this.p5 = new p5(this.sketch, this.myRef.current);
    }
    render() {
        return (
            <div>
                <div ref={this.myRef}></div>
            </div>
        )
    }
}
