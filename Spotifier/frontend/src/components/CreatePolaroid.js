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
        // var canvas = document.getElementById("polaroid-canvas");
        // var context = canvas.getContext("2d");

        // context.clearRect(0, 0, canvas.width, canvas.height);

        // context.beginPath();
        // context.rect(0, 0, 500, 800);
        // context.fillStyle = "#dcd9d2";
        // context.fill();

        switch (response.type) {
            case "album":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);

                this.drawArt(response.images[0].url, context);
                document.fonts.ready.then(function () {
                    var xloc = 30;
                    var yloc = drawTitle(response.name, context);

                    // Should turn next into function
                    yloc += 28;

                    context.font = "100 24px Oswald";

                    context.fillText(response.release_date.split('-')[0], xloc, yloc);

                    yloc += 28;

                    context.font = "24px Oswald";

                    var tracks = response.tracks.items

                    for (var i = 0; i < tracks.length; i++) {
                        var trackwords = tracks[i].name.split(' ');

                        var line = '';

                        for (var j = 0; j < trackwords.length; j++) {
                            var testLine = line + trackwords[j] + ' ';
                            var metrics = context.measureText(testLine);
                            var testWidth = metrics.width;
                            if (testWidth > 440 && j > 0) {
                                context.fillText(line, xloc, yloc);
                                line = trackwords[j] + ' ';
                                yloc += 20;
                            }
                            else {
                                line = testLine;
                            }

                        }
                        context.fillText(line, xloc, yloc);
                        yloc += 20;
                    }

                });
                break;

            case "track":
                document.getElementById("polaroid-album-art").setAttribute("src", response.album.images[0].url);

                this.drawArt(response.album.images[0].url, context);
                document.fonts.ready.then(function () {
                    var xloc = 30;
                    var yloc = drawTitle(response.name, context);
                });
                break;

            case "artist":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);

                this.drawArt(response.images[0].url, context);

                document.fonts.ready.then(function () {
                    var xloc = 30;
                    var yloc = drawTitle(response.name, context);
                });
                break;

            case "playlist":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);

                this.drawArt(response.images[0].url, context);
                document.fonts.ready.then(function () {
                    var xloc = 30;
                    var yloc = drawTitle(response.name, context);
                });
                break;

        }




    };

    drawArt(imgURL, context) {
        var img = new Image();
        img.onload = function () {
            context.drawImage(img, 30, 30, 440, 440);
        }
        img.src = imgURL;
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
                    alignItems="center"
                    justify="center"
                    item
                    xs={12}
                    align="center"
                >
                    <Paper item pt={6} xs={3} component={Grid}>
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
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Include Length" />
                                </Tooltip>
                                <Tooltip title="Include the artist's name in the polaroid design!" arrow placement="right">
                                    <FormControlLabel control={<Checkbox defaultChecked />} label="Include Artist" />
                                </Tooltip>
                                <Tooltip title="Remove (Remastered) from track/album names!" arrow placement="right">
                                    <FormControlLabel control={<Checkbox />} label="Include Remastered" />
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

                </Grid>

                <div id="polaroid-canvas" width="500" height="800" color="red" >
                    <img style={{
                        width: 440, height: 440, marginTop: 30, marginRight: 30, marginLeft: 30,
                    }}
                        id="polaroid-album-art"
                    ></img>
                    <p></p>
                </div>
                <span style={{ fontFamily: "Oswald", color: "#d0ccc4" }}>
                    HELLO
                </span>

            </Grid>

        );
    }
}

function drawTitle(title, context) {
    context.font = "40px Oswald";
    context.fillStyle = "#2c2b29";

    var words = title.split(' ');
    var line = '';
    var xloc = 30;
    var yloc = 510

    for (var n = 0; n < words.length; n++) {

        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > 440 && n > 0) {
            context.fillText(line, xloc, yloc);
            line = words[n] + ' ';
            yloc += 40;
        }
        else {
            line = testLine;
        }
    }

    context.fillText(line, xloc, yloc);

    return yloc;
}
