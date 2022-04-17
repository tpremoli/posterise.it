import * as React from 'react';

export default function Polaroid() {

    return (
        <div id="polaroid-canvas" style={{
            backgroundColor: "#dcd9d2", width: 500, height: 800, margin: 10,
        }} >
            <img style={{
                width: 430, height: 435, marginTop: 30, marginRight: 35, marginLeft: 35, marginBottom: 0,
            }}
                id="polaroid-album-art"
            ></img>

            <div id="polaroid-text-holder"
                style={{
                    width: 430, height: 435, marginTop: 0, marginRight: 35, marginLeft: 35, marginBottom: 30,
                    wordWrap: "break-word",
                }}>
                <p style={{
                    fontFamily: "Oswald", color: "#2c2b29", fontSize: "38px", fontWeight: 400,
                    marginLeft: 0, marginTop: 0, lineHeight: "90%",
                }}
                    id="polaroid-resource-title"
                >
                </p>
                <p style={{
                    fontFamily: "Oswald", color: "#2c2b29", fontSize: "24px", fontWeight: 200,
                    marginLeft: 0, marginTop: -30, lineHeight: "90%",
                }}
                    id="polaroid-resource-year"
                >
                </p>
                <div id="polaroid-resource-tracks" style={{
                    fontFamily: "Oswald", color: "#2c2b29", fontSize: "24px", fontWeight: 400,
                    marginLeft: 0, marginTop: -20, lineHeight: "90%",
                }}>
                </div>
            </div>
        </div>
    );

}

