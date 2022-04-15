import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { Collapse, Paper } from "@mui/material";
import Alert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import ScrollDialog from "./URIHelpDialog.js";
import html2canvas from 'html2canvas';

export default class CreatePolaroid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotifyAuthenticated: false,
            uri: "blank",
            errorMsg: "",
            successMsg: "",
        }
        this.handleURIChange = this.handleURIChange.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
        this.paintImg = this.paintImg.bind(this);
        this.isOutsideContainer = this.isOutsideContainer.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.authenticateSpotify();
    }

    handleURIChange(e) {
        this.setState({
            uri: e.target.value,
        });
    }

    handleCreateButtonPressed() {
        const requestOptions = {
            method: 'GET',
        };

        var id;
        var type = "blank";
        var uri = this.state.uri;

        if (uri.startsWith("spotify:album:")) {
            id = uri.substring(14)
            type = "albums";
            this.setState({
                successMsg: "Selected album!",
            });

        } else if (uri.startsWith("spotify:track:")) {
            id = uri.substring(14)
            type = "tracks";
            this.setState({
                successMsg: "Selected track!",
            });

        } else if (uri.startsWith("spotify:playlist:")) {
            id = uri.substring(17)
            type = "playlists";
            this.setState({
                successMsg: "Selected playlist!",
            });

        } else if (uri.startsWith("spotify:artist:")) {
            id = uri.substring(15);
            type = "artists";
            this.setState({
                successMsg: "Selected artist!",
            });

        } else {
            document.getElementById("polaroid-album-art").setAttribute("src", "");
            document.getElementById("polaroid-resource-title").innerHTML = "";
            document.getElementById("polaroid-resource-year").innerHTML = "";
            this.setState({
                errorMsg: "Invalid URI!",
            });
        }

        if (type != "blank") {
            // Execute API calls and handle data
            fetch("/polaroidize/?id=" + id + "&type=" + type, requestOptions)
                .then((response) => response.json())
                .then((response) => {
                    // Handle passed or failed responses
                    console.log(response);
                    if (response.status == 200) {

                        this.paintImg(response);

                    } else {
                        document.getElementById("polaroid-album-art").setAttribute("src", "");
                        document.getElementById("polaroid-resource-title").innerHTML = "";
                        this.setState({
                            errorMsg: "Error: " + response.errorMsg,
                        });

                    }
                });
        }
    }

    authenticateSpotify() {
        fetch("/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ spotifyAuthenticated: data.status });
                if (!data.status) {
                    fetch("/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    }

    paintImg(response) {
        document.getElementById("polaroid-resource-title").innerHTML = response.name;
        document.getElementById("polaroid-resource-tracks").style.fontSize = '24px';

        switch (response.type) {
            case "album":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);
                document.getElementById("polaroid-resource-year").style.fontStyle = "normal";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;
                document.getElementById("polaroid-resource-year").innerHTML = response.release_date.split('-')[0];

                document.getElementById("polaroid-paper").hidden = false;

                const tracks = response.tracks.items;

                var resourceTracks = document.getElementById("polaroid-resource-tracks");
                resourceTracks.innerHTML = "";

                tracks.forEach(function (track) {
                    var trackline = document.createElement("p");
                    var trackname = document.createTextNode(track.name);
                    trackline.appendChild(trackname);
                    trackline.style.cssText = "margin-top: -20px;";
                    trackline.className += "track-line";

                    resourceTracks.appendChild(trackline);
                }, this);

                const lastChild = resourceTracks.lastChild;
                const canvas = document.getElementById("polaroid-canvas");

                while (this.isOutsideContainer(canvas, lastChild)) {
                    const fontSize = parseFloat(window.getComputedStyle(resourceTracks, null).getPropertyValue('font-size'));
                    resourceTracks.style.fontSize = (fontSize - 1) + 'px';

                    var tracklines = document.getElementsByClassName('track-line');

                    for (var i = 0; i < tracklines.length; i++) {
                        var trackline = tracklines[i];
                        var marginTop = parseFloat(window.getComputedStyle(trackline, null).getPropertyValue('margin-top'));
                        trackline.style.marginTop = (marginTop + 1) + 'px';
                    }
                }



                break;

            case "track":
                document.getElementById("polaroid-album-art").setAttribute("src", response.album.images[0].url);
                document.getElementById("polaroid-resource-year").style.fontStyle = "normal";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;
                document.getElementById("polaroid-resource-year").innerHTML = response.artists[0].name + " - " + response.album.release_date.split('-')[0];

                document.getElementById("polaroid-paper").hidden = false;

                var resourceTracks = document.getElementById("polaroid-resource-tracks");
                resourceTracks.innerHTML = "";

                break;

            case "artist":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);
                document.getElementById("polaroid-resource-year").innerHTML = "";

                document.getElementById("polaroid-paper").hidden = false;

                var resourceTracks = document.getElementById("polaroid-resource-tracks");
                resourceTracks.innerHTML = "";

                break;

            case "playlist":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);
                document.getElementById("polaroid-resource-year").style.fontStyle = "italic";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;
                document.getElementById("polaroid-resource-year").innerHTML = "A playlist by " + response.owner.display_name;

                document.getElementById("polaroid-paper").hidden = false;

                var resourceTracks = document.getElementById("polaroid-resource-tracks");
                resourceTracks.innerHTML = "";

                break;
        }

        // Separate image is necessary to avoid desync when loading image
        var canvasimg = new Image();
        canvasimg.onload = function () {
            // Converting html image display into canvas image
            html2canvas(document.getElementById("polaroid-canvas"), {
                useCORS: true,
            }).then(canvas => {
                // document.body.appendChild(canvas);
                // 
                var dataURL = canvas.toDataURL("image/png");
                var newTab = window.open('about:blank', 'image from canvas');
                newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
            });
        }
        canvasimg.src = document.getElementById("polaroid-album-art").getAttribute("src");



    };

    isOutsideContainer(parentDiv, childDiv) {
        const parentRect = parentDiv.getBoundingClientRect();
        const childRect = childDiv.getBoundingClientRect();

        return parentRect.bottom - 15 < childRect.bottom;
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse
                        in={this.state.errorMsg != ""}
                    >
                        <Alert
                            variant="filled"
                            color="error"
                            severity="error"
                            onClose={() => {
                                this.setState({ errorMsg: "" });
                            }}
                        >
                            {this.state.errorMsg}
                        </Alert>
                    </Collapse>
                    <Collapse
                        in={this.state.successMsg != ""}
                    >
                        <Alert
                            variant="filled"
                            color="success"
                            severity="success"
                            onClose={() => {
                                this.setState({ successMsg: "" });
                            }}
                        >
                            {this.state.successMsg}
                        </Alert>
                    </Collapse>
                </Grid>

                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Paper item pt={6} xs={3} component={Grid} mr={4}>
                        <Grid item xs={12} align="center" >
                            <Typography component="h4" variant="h4">
                                Create A Polaroid!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <FormControl component="fieldset">

                                <FormHelperText style={{ textAlign: "center" }}>
                                    Options
                                </FormHelperText>

                                <Tooltip title="Include the length of the album/track/playlist in the polaroid design!" arrow placement="right">
                                    <FormControlLabel disabled control={<Checkbox defaultChecked />} label="Include Length" />
                                </Tooltip>
                                <Tooltip title="Include the artist's name in the polaroid design!" arrow placement="right">
                                    <FormControlLabel disabled control={<Checkbox defaultChecked />} label="Include Artist" />
                                </Tooltip>
                                <Tooltip title="Remove (Remastered) from track/album names!" arrow placement="right">
                                    <FormControlLabel disabled control={<Checkbox />} label="Include Remastered" />
                                </Tooltip>
                                <TextField id="standard-basic" label="URI" variant="standard" onChange={this.handleURIChange} />

                                <ScrollDialog />

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} pb={2} align="center">
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={this.handleCreateButtonPressed}
                            >
                                Create Polaroid!
                            </Button>
                        </Grid>
                        <Grid item xs={12} pb={6} align="center">
                            <Button color="secondary" variant="outlined" to="/" component={Link}>
                                Back to home
                            </Button>
                        </Grid>
                    </Paper>

                    <Paper id="polaroid-paper" item p={3} component={Grid} hidden={true} style={{
                    }}>
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
                                    fontFamily: "Oswald", color: "#2c2b29", fontSize: "38px",
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
                    </Paper>

                </Grid>

            </Grid>

        );
    }
}
