import React, { Component } from "react";

export default class CreatePolaroid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotifyAuthenticated: false,
        }
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.authenticateSpotify();
    }

    authenticateSpotify() {
        fetch("/polaroidizer/is-authenticated").then(res => res.text())
            .then(text => console.log(text));
        
        fetch("/polaroidizer/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ spotifyAuthenticated: data.status });
                console.log(data.status);
                if (!data.status) {
                    fetch("/polaroidizer/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    }

    render() {
        return <p> this is the create polaroid page </p>;
    }
}
