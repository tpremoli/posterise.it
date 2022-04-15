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

        switch (response.type) {
            case "album":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);
                document.getElementById("polaroid-resource-year").style.fontStyle = "normal";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;
                document.getElementById("polaroid-resource-year").innerHTML = response.release_date.split('-')[0];

                this.drawArt(response.images[0].url, context);
                break;

            case "track":
                document.getElementById("polaroid-album-art").setAttribute("src", response.album.images[0].url);
                document.getElementById("polaroid-resource-year").style.fontStyle = "normal";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;
                document.getElementById("polaroid-resource-year").innerHTML = response.artists[0].name + " - " + response.album.release_date.split('-')[0];

                break;

            case "artist":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);
                document.getElementById("polaroid-resource-year").innerHTML = "";

                break;

            case "playlist":
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);
                document.getElementById("polaroid-resource-year").style.fontStyle = "italic";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;
                document.getElementById("polaroid-resource-year").innerHTML = "A playlist by " + response.owner.display_name;

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

                </Grid>

                <div id="polaroid-canvas" style={{
                    backgroundColor: "#dcd9d2", position: "absolute", width: 500, height: 800,
                }} >
                    <img style={{
                        width: 430, height: 430, marginTop: 35, marginRight: 35, marginLeft: 35, marginBottom: 0,
                    }}
                        id="polaroid-album-art"
                    ></img>

                    <div id="polaroid-text-holder"
                        style={{
                        width: 430, height: 430, marginTop: 0, marginRight: 35, marginLeft: 35, marginBottom: 35,
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



                    </div>
                </div>

                <Grid>

                </Grid>

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
