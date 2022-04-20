import * as React from 'react';

export default function Poster() {

    return (
        <div id="poster-canvas" style={{
            backgroundColor: "#dcd9d2", width: 500, height: 750, margin: 0,
        }} >
            <img style={{
                width: 430, height: 430, marginTop: 30, marginRight: 35, marginLeft: 35, marginBottom: 0,
            }}
                id="poster-album-art"
            ></img>

            <div id="poster-text-holder"
                style={{
                    width: 430, height: 435, marginTop: 0, marginRight: 35, marginLeft: 35, marginBottom: 30,
                    wordWrap: "break-word",
                }}>
                <p style={{
                    fontFamily: "Oswald", color: "#2c2b29", fontSize: "38px", fontWeight: 400,
                    marginLeft: 0, marginTop: 0, lineHeight: "90%",
                }}
                    id="poster-resource-title"
                >
                </p>
                <p style={{
                    fontFamily: "Oswald", color: "#2c2b29", fontSize: "24px", fontWeight: 200,
                    marginLeft: 0, marginTop: -30, lineHeight: "90%",
                }}
                    id="poster-resource-year"
                >
                </p>
                <div id="poster-resource-tracks" style={{
                    fontFamily: "Oswald", color: "#2c2b29", fontSize: "24px", fontWeight: 400,
                    marginLeft: 0, marginTop: -20, lineHeight: "90%",
                }}>
                </div>
            </div>
        </div>
    );

}

