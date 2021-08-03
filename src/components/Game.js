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
        p.BLACK = [0, 0, 0];
        p.RED = [255, 0, 0];
        p.BLUE = [0, 0, 255];
        p.setup = function () {
            p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.8);
        }
        p.drawHexagon = function (center, size, row = -1, col = -1) {
            p.stroke(p.BLACK);
            p.strokeWeight(2);
            let points = [];
            p.beginShape();
            for (let i = 0; i < 6; i++) {
                let angle = i * Math.PI / 3 + Math.PI / 2;
                p.vertex(center[0] + size * Math.cos(angle), center[1] - size * Math.sin(angle));
                points.push([center[0] + size * Math.cos(angle), center[1] - size * Math.sin(angle)]);
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
            let cellSize = 40;
            p.stroke(100);
            for (let i = 0; i < p.hex.HEIGHT; i++) {
                for (let j = 0; j < p.hex.WIDTH; j++) {
                    let s60 = Math.sin(Math.PI / 3);
                    let x = cellSize * 1.5 + i * cellSize * s60 + j * 2 * cellSize * s60;
                    let y = cellSize * 1.5 + i * cellSize * 3 / 2;
                    p.drawHexagon([x, y], cellSize, i, j)
                }
            }
        }
    }
    componentDidMount() {
        this.myP5 = new p5(this.sketch, this.myRef.current);
    }
    render() {
        return (
            <div>
                <div ref={this.myRef}></div>
            </div>
        )
    }
}
