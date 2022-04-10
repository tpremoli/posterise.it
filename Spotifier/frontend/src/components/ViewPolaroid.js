import React, { Component } from "react";

export default class ViewPolaroid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uri: "blank",
            is_album: false
        };
        this.polaroidID = this.props.match.params.polaroidID;
        // console.log(this.props.match.params);
    }

    render() {
        return (
        <div>
            <h3>{this.polaroidID}</h3>
            <p>uri: {this.state.uri}</p>
            <p>is_album: {this.state.is_album}</p>
        </div>
        );
    }
}
