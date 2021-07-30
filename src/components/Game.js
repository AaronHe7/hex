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
        p.setup = function () {
            p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.8);
        }
        p.drawHexagon = function (center, size) {
            let points = [];
            p.beginShape();
            p.endShape(p.CLOSE);
        }
        p.draw = function () {
            p.background(0);
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
