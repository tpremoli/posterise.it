import React, { Component } from "react";
import Button from '@mui/material/Button';

export default class PolaroidCanvas extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>

                <canvas id="polaroid-canvas" width="500" height="800" style={divStyle}>

                    Your browser does not support the HTML canvas tag.
                </canvas>

                <Button onClick={paintImg('https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25')} color="info">What's this?</Button>

                <div>
                    <img
                        id="polaroid-cover"
                        src="https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25"
                    >
                    </img>
                </div>
            </div>

        );
    }
}

const divStyle = {
    backgroundColor: '#dcd9d2',
};

const paintImg = (imgURL) => () => {
    var canvas = document.getElementById("polaroid-canvas");
    var canvasState = canvas.getContext("2d");
    var img = document.getElementById("polaroid-cover");
    canvasState.drawImage(img, 30, 30, 440, 440);
};