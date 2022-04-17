import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { Collapse, Paper, RadioGroup } from "@mui/material";
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import Alert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import URIHelpDialog from "./URIHelpDialog.js";
import Polaroid from "./Polaroid.js";
import html2canvas from 'html2canvas';

export default class CreatePolaroid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotifyAuthenticated: false,
            uri: "blank",
            errorMsg: "",
            successMsg: "",
            includeArtist: false,
            includeLength: false,
            removeRemastered: false,
            response: null,
        }
        // Parameter methods
        this.handleURIChange = this.handleURIChange.bind(this);
        this.handleLengthChange = this.handleLengthChange.bind(this);
        this.handleReturnPressed = this.handleReturnPressed.bind(this);
        this.handleArtistName = this.handleArtistName.bind(this);

        // Creation methods
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
        this.paintImg = this.paintImg.bind(this);
        this.fitTracks = this.fitTracks.bind(this);
        this.shrinkFont = this.shrinkFont.bind(this);
        this.isOutsideContainer = this.isOutsideContainer.bind(this);

        // Customization methods
        this.handleRemasteredChange = this.handleRemasteredChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleArtistChange = this.handleArtistChange.bind(this);

        // Authentication methods
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.authenticateSpotify();

        // Utility methods
        this.clearPolaroid = this.clearPolaroid.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleArtistChange(e) {
        this.setState({
            includeArtist: e.target.checked,
        }, () => {
            var resourceloc = document.getElementById("polaroid-resource-year");
            if (this.state.includeArtist) {
                if (this.state.response.type == "album" || this.state.response.type == "track") {
                    resourceloc.innerHTML = this.state.response.artists[0].name;
                    if (this.state.response.type == "album")
                        resourceloc.innerHTML += " - " + this.state.response.release_date.split('-')[0];
                    else
                        resourceloc.innerHTML += " - " + this.state.response.album.release_date.split('-')[0];
                }
            } else {
                if (this.state.response.type == "album" || this.state.response.type == "track") {
                    if (this.state.response.type == "album")
                        resourceloc.innerHTML = this.state.response.release_date.split('-')[0];
                    else
                        resourceloc.innerHTML = this.state.response.album.release_date.split('-')[0];
                }
            }
        });
    }
    handleArtistName() {
        var resourceloc = document.getElementById("polaroid-resource-year");
        if (this.state.includeArtist) {
            resourceloc.innerHTML = this.state.response.artists[0].name;
            if (this.state.response.type == "album")
                resourceloc.innerHTML += " - " + this.state.response.release_date.split('-')[0];
            else
                resourceloc.innerHTML += " - " + this.state.response.album.release_date.split('-')[0];
        } else {
            if (this.state.response.type == "album")
                resourceloc.innerHTML = this.state.response.release_date.split('-')[0];
            else
                resourceloc.innerHTML = this.state.response.album.release_date.split('-')[0];
        }
    }

    handleLengthChange(e) {
        this.setState({
            includeLength: e.target.checked,
        });
    }

    handleRemasteredChange(e) {
        this.setState({
            removeRemastered: e.target.checked,
        }, () => {
            this.paintImg(JSON.parse(JSON.stringify(this.state.response)));
        });
    }

    handleURIChange(e) {
        this.setState({
            uri: e.target.value,
        });
    }

    handleReturnPressed(e) {
        this.clearPolaroid();
        document.getElementById("customize-page").hidden = true;
        document.getElementById("create-page").hidden = false;

    }

    handleDownload() {
        document.getElementById("polaroid-paper").style.transform = "scale(1, 1)";

        console.log(window.devicePixelRatio);

        // Converting html image display into canvas image
        html2canvas(document.getElementById("polaroid-canvas"), {
            useCORS: true, scale: 3,
        }).then(canvas => {
            // Displaying generated canvas (probs change to download)
            var dataURL = canvas.toDataURL("image/png");

            var link = document.createElement("a");
            link.download = this.state.response.name + "poster.png";
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        document.getElementById("polaroid-paper").style.transform = "scale(0.8, 0.8)";
    }

    handleCreateButtonPressed() {
        const requestOptions = {
            method: 'GET',
        };

        var id;
        var type = "blank";
        var uri = this.state.uri;

        // Parsing the resource type and setting the success message
        if (uri.startsWith("spotify:album:")) {
            id = uri.substring(14)
            type = "albums";
            this.setState({
                errorMsg: "",
                successMsg: "Selected album!",
            });

        } else if (uri.startsWith("spotify:track:")) {
            id = uri.substring(14)
            type = "tracks";
            this.setState({
                errorMsg: "",
                successMsg: "Selected track!",
            });

        } else if (uri.startsWith("spotify:playlist:")) {
            id = uri.substring(17)
            type = "playlists";
            this.setState({
                errorMsg: "",
                successMsg: "Selected playlist!",
            });

        } else if (uri.startsWith("spotify:artist:")) {
            id = uri.substring(15);
            type = "artists";
            this.setState({
                errorMsg: "",
                successMsg: "Selected artist!",
            });

        } else {
            // handling invalid uri and clearing all the data in the polaroid
            this.clearPolaroid();

            this.setState({
                successMsg: "",
                errorMsg: "Invalid URI!",
            });
            return;
        }

        if (type != "blank") {
            // Execute API calls and handle data
            fetch("/polaroidize/?id=" + id + "&type=" + type, requestOptions)
                .then((response) => response.json())
                .then((response) => {
                    // Handle passed or failed responses
                    console.log(response);
                    // If the response is valid then paint the image
                    if (response.status == 200) {

                        document.getElementById("create-page").hidden = true;
                        document.getElementById("customize-page").hidden = false;
                        this.setState({
                            removeRemastered: false,
                            response: response,
                        }, () => {
                            this.paintImg(JSON.parse(JSON.stringify(this.state.response)));
                        });

                    } else {
                        // handling invalid uri and clearing all the data in the polaroid if fetch failed
                        this.clearPolaroid();
                        this.setState({
                            successMsg: "",
                            errorMsg: "Error: " + response.errorMsg,
                        });

                    }
                });
        }
    }

    clearPolaroid() {
        // handling invalid uri and clearing all the data in the polaroid
        document.getElementById("polaroid-album-art").setAttribute("src", "");
        document.getElementById("polaroid-resource-title").innerHTML = "";
        document.getElementById("polaroid-resource-year").innerHTML = "";
        var resourceTracks = document.getElementById("polaroid-resource-tracks");
        resourceTracks.innerHTML = "";

        document.getElementById("polaroid-paper").hidden = true;
    }

    // Authenticate spotify scripts
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

    // This function is responsible for rendering the html elements in the polaroid
    paintImg(response) {
        // This checks if to remove remastered tags
        if (this.state.removeRemastered) {
            // Clearing title section
            const titleSection = document.getElementById("polaroid-resource-title");
            titleSection.innerHTML = "";

            // Splitting it by ( and adding first element generally removes remastered sign
            const splitName = response.name.split('(');

            titleSection.innerHTML += splitName[0]

            // This will account for cases where there's more than one () in album title
            for (var i = 1; i < splitName.length - 1; i++) {
                titleSection.innerHTML += "(" + splitName[i];
            }
        } else {
            document.getElementById("polaroid-resource-title").innerHTML = response.name;
        }

        // Resetting track fontsize
        document.getElementById("polaroid-resource-tracks").style.fontSize = '24px';

        switch (response.type) {
            case "album":
                // Setting album art
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);

                // Setting year style for this type
                document.getElementById("polaroid-resource-year").style.fontStyle = "normal";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;

                // Setting year for this type
                this.handleArtistName();

                // Reveal the document
                document.getElementById("polaroid-paper").hidden = false;
                document.getElementById("polaroid-paper").style.transform = "scale(0.8, 0.8)";

                // The tracks in the album
                const albumTracks = response.tracks.items;

                // The container for track elements
                var trackContainer = document.getElementById("polaroid-resource-tracks");
                trackContainer.innerHTML = "";

                // Creates track elements in the countainer for each track in the album
                albumTracks.forEach(function (track) {
                    if (this.state.removeRemastered) {
                        // Getting name and resetting it
                        var trackname = track.name;
                        track.name = "";

                        // Splitting it by ( and adding first element generally removes remastered sign
                        const splitName = trackname.split('-');

                        track.name += splitName[0]

                        // This will account for cases where there's more than one () in album title
                        for (var i = 1; i < splitName.length - 1; i++) {
                            track.name += "-" + splitName[i];
                        }
                    }

                    // Creating p element with necessary styling and classes.
                    var trackline = document.createElement("p");
                    var trackname = document.createTextNode(track.name);
                    trackline.appendChild(trackname);
                    trackline.style.cssText = "margin-top: -20px;";
                    trackline.className += "track-line";

                    trackContainer.appendChild(trackline);
                }, this);

                // Make sure that all the tracks fit the container and fix it.
                this.fitTracks(trackContainer);

                break;

            case "track":
                // Setting album art
                document.getElementById("polaroid-album-art").setAttribute("src", response.album.images[0].url);

                // Setting year resource styling
                document.getElementById("polaroid-resource-year").style.fontStyle = "normal";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;

                // Setting year resource text
                this.handleArtistName();

                // Revealing the polaroid
                document.getElementById("polaroid-paper").hidden = false;
                document.getElementById("polaroid-paper").style.transform = "scale(0.8, 0.8)";

                // Clearing the tracklist. Should have other data here
                var trackContainer = document.getElementById("polaroid-resource-tracks");
                trackContainer.innerHTML = "";

                break;

            case "artist":
                // Setting album art
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);

                // Clearing year resource
                document.getElementById("polaroid-resource-year").innerHTML = "";

                // Revealing the polaroid
                document.getElementById("polaroid-paper").hidden = false;
                document.getElementById("polaroid-paper").style.transform = "scale(0.8, 0.8)";

                // Clearing the tracklist. Should have other data here
                var trackContainer = document.getElementById("polaroid-resource-tracks");
                trackContainer.innerHTML = "";

                break;

            case "playlist":
                // Setting album art
                document.getElementById("polaroid-album-art").setAttribute("src", response.images[0].url);

                // Resetting year resource styling
                document.getElementById("polaroid-resource-year").style.fontStyle = "italic";
                document.getElementById("polaroid-resource-year").style.fontWeight = 300;

                // Setting year resource text
                document.getElementById("polaroid-resource-year").innerHTML = "A playlist by " + response.owner.display_name;

                // Revealing the polaroid
                document.getElementById("polaroid-paper").hidden = false;
                document.getElementById("polaroid-paper").style.transform = "scale(0.8, 0.8)";

                // Clearing the tracklist. Should have other data here
                var trackContainer = document.getElementById("polaroid-resource-tracks");
                trackContainer.innerHTML = "";

                break;
        }
        document.getElementById("create-page").hidden = true;
    };

    fitTracks(trackContainer) {
        // Gets the last child to see if it overflows
        var lastChild = trackContainer.lastChild;
        const canvas = document.getElementById("polaroid-canvas");

        // Shrink to minimum font size of 20 (good level)
        this.shrinkFont(trackContainer, 20);

        // Squash to points to the location where the two tracks will be squashed into one p element
        var squashTo = trackContainer.firstChild;

        // While the tracks are overflowing and we haven't squashed everything yet this squashes.
        while (this.isOutsideContainer(canvas, lastChild) && squashTo != lastChild && squashTo != null) {
            // Sets the squashto innerhtml to include the next track's name
            squashTo.innerHTML = squashTo.innerHTML.trim() + " / " + squashTo.nextSibling.innerHTML;

            // Removes the next track and sets squashto to next value
            squashTo.nextSibling.remove();
            squashTo = squashTo.nextSibling;
        }

        // Checks if last child is still out of the container. if so shrink with no min value.
        lastChild = trackContainer.lastChild;
        if (this.isOutsideContainer(canvas, lastChild)) {
            this.shrinkFont(trackContainer);
        }
    }

    shrinkFont(trackContainer, minFontSize = 0) {
        const lastChild = trackContainer.lastChild;
        const canvas = document.getElementById("polaroid-canvas");
        var fontSize = parseFloat(window.getComputedStyle(trackContainer, null).getPropertyValue('font-size'));

        // While the last child is overflowing, reduce the font size
        while (this.isOutsideContainer(canvas, lastChild) && fontSize > minFontSize) {
            // Reducing font size by 1
            trackContainer.style.fontSize = (fontSize - 1) + 'px';
            fontSize--;

            // Gets all the children
            var tracklines = document.getElementsByClassName('track-line');

            // Sets the children's margin to be a lil bigger after shrinking (looks better)
            for (var i = 0; i < tracklines.length; i++) {
                var trackline = tracklines[i];
                var marginTop = parseFloat(window.getComputedStyle(trackline, null).getPropertyValue('margin-top'));
                trackline.style.marginTop = (marginTop + 1) + 'px';
            }

        }

    }

    handleColorChange(e) {
        switch (e.target.value) {
            case "Inverted":
                document.getElementById("polaroid-canvas").style.backgroundColor = "#2c2b29";
                document.getElementById("polaroid-resource-title").style.color = "#dcd9d2";
                document.getElementById("polaroid-resource-year").style.color = "#dcd9d2";
                document.getElementById("polaroid-resource-tracks").style.color = "#dcd9d2";
                break;
            default:
                document.getElementById("polaroid-canvas").style.backgroundColor = "#dcd9d2";
                document.getElementById("polaroid-resource-title").style.color = "#2c2b29";
                document.getElementById("polaroid-resource-year").style.color = "#2c2b29";
                document.getElementById("polaroid-resource-tracks").style.color = "#2c2b29";
        }
    }

    // Checks if childDiv is outside the container
    isOutsideContainer(parentDiv, childDiv, border = 20) {
        const parentRect = parentDiv.getBoundingClientRect();
        const childRect = childDiv.getBoundingClientRect();

        return parentRect.bottom - border < childRect.bottom;
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
                    hidden={false}
                >
                    <Paper id="create-page" item p={3} m={3} component={Grid} >
                        <Grid item xs={12} align="center" >
                            <Typography component="h4" variant="h4">
                                Create A Polaroid!
                            </Typography>
                            <p style={{
                                fontFamily: "Oswald", color: "#f7f2eb", fontSize: "1px", fontWeight: 400,
                            }}
                            >
                                Placeholder to load font
                            </p>
                            <p style={{
                                fontFamily: "Oswald", color: "#f7f2eb", fontSize: "1px", fontWeight: 200,
                            }}
                            >
                                Placeholder to load font
                            </p>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <FormControl component="fieldset">

                                <TextField id="standard-basic" label="URI" variant="standard"
                                    onChange={this.handleURIChange} />
                                <URIHelpDialog />

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

                    <Paper id="customize-page" item p={3} m={3} component={Grid} hidden={true}>
                        <Grid item xs={12} align="center" >
                            <Typography component="h4" variant="h4">
                                Customize Poster
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <FormControl component="fieldset">

                                <FormHelperText style={{ textAlign: "center" }}>
                                    Options
                                </FormHelperText>

                                <RadioGroup row label="Color scheme" defaultValue="Default" onChange={this.handleColorChange}>
                                    <FormControlLabel control={<Radio />} value="Default" label="Default" />
                                    <FormControlLabel control={<Radio />} value="Inverted" label="Inverted" />
                                    <Tooltip title="Not yet implemented!" arrow placement="bottom">
                                        <FormControlLabel disabled control={<Radio />} value="Sample" label="Color sample" />
                                    </Tooltip>
                                </RadioGroup>


                                <Tooltip title="Include the artist's name in the polaroid design!" arrow placement="left">
                                    <FormControlLabel control={<Switch />} label="Include Artist"
                                        onChange={this.handleArtistChange} />
                                </Tooltip>

                                <Tooltip title="Include the length of the album/track/playlist in the polaroid design!" arrow placement="left">
                                    <FormControlLabel disabled control={<Switch />} label="Include Length" />
                                </Tooltip>

                                <Tooltip title="Remove (Remastered) from track/album names!" arrow placement="left">
                                    <FormControlLabel control={<Switch />} label="Remove Remastered Tags"
                                        checked={this.state.removeRemastered} onChange={this.handleRemasteredChange} />
                                </Tooltip>


                            </FormControl>
                        </Grid>


                        <Grid item xs={12} pb={2} align="center">
                            <Button color="success" variant="contained" onClick={this.handleDownload}>
                                Download!
                            </Button>
                        </Grid>
                        <Grid item xs={12} pb={6} align="center">
                            <Button color="secondary" variant="outlined" to="/" onClick={this.handleReturnPressed}>
                                Return
                            </Button>
                        </Grid>
                    </Paper>


                    <Paper id="polaroid-paper" m={3} p={3} item component={Grid} hidden={true} style={{
                    }}>
                        <Polaroid />
                    </Paper>

                </Grid>

            </Grid>

        );
    }
}
