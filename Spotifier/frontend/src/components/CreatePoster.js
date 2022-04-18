import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Tooltip from '@mui/material/Tooltip';
import { Collapse, Paper, RadioGroup } from "@mui/material";
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import Alert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import URIHelpDialog from "./URIHelpDialog.js";
import Poster from "./Poster.js";
import html2canvas from 'html2canvas';

export default class CreatePoster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotifyAuthenticated: false,
            uri: "blank",
            errorMsg: "",
            successMsg: "",
            includeArtist: false,
            removeRemastered: false,
            response: null,

            disallowNameAdd: false,
            disallowRRemoval: false,
            disallowFlavor: false,

            flavorLabel: "Flavor text",
            artistLabel: "Include Artist"
        }
        // Parameter methods
        this.handleURIChange = this.handleURIChange.bind(this);
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
        this.handleFlavorTextChange = this.handleFlavorTextChange.bind(this);
        this.handleFlavorTextRender = this.handleFlavorTextRender.bind(this);

        // Authentication methods
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.authenticateSpotify();

        // Utility methods
        this.clearPoster = this.clearPoster.bind(this);
        this.revealPoster = this.revealPoster.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.getURI = this.getURI.bind(this);
    }

    // This method handles rendering the artist name when the flip is switched
    handleArtistChange(e) {
        this.setState({
            includeArtist: e.target.checked,
        }, () => {
            var resourceloc = document.getElementById("poster-resource-year");
            if (this.state.includeArtist) {
                if (this.state.response.type != "artist") {
                    if (this.state.response.type == "album") {
                        resourceloc.innerHTML = this.state.response.artists[0].name;
                        resourceloc.innerHTML += " - " + this.state.response.release_date.split('-')[0];
                    }
                    else if (this.state.response.type == "track") {
                        resourceloc.innerHTML = this.state.response.artists[0].name;
                        resourceloc.innerHTML += " - " + this.state.response.album.release_date.split('-')[0];
                    } else {
                        resourceloc.innerHTML = this.state.response.owner.display_name;
                        resourceloc.innerHTML += " - " + this.state.response.description;
                    }
                }
            } else {
                if (this.state.response.type != "artist") {
                    if (this.state.response.type == "album") {
                        resourceloc.innerHTML = this.state.response.release_date.split('-')[0];
                    }
                    else if (this.state.response.type == "track") {
                        resourceloc.innerHTML = this.state.response.album.release_date.split('-')[0];
                    } else {
                        resourceloc.innerHTML = this.state.response.description;
                    }
                }
            }
        });
    }

    // This method renders the artist name depending on what option the user has selected
    // (This runs when painting tracks/albums)
    handleArtistName() {
        var resourceloc = document.getElementById("poster-resource-year");
        if (this.state.includeArtist) {
            if (this.state.response.type != "artist") {
                if (this.state.response.type == "album") {
                    resourceloc.innerHTML = this.state.response.artists[0].name;
                    resourceloc.innerHTML += " - " + this.state.response.release_date.split('-')[0];
                }
                else if (this.state.response.type == "track") {
                    resourceloc.innerHTML = this.state.response.artists[0].name;
                    resourceloc.innerHTML += " - " + this.state.response.album.release_date.split('-')[0];
                } else {
                    resourceloc.innerHTML = this.state.response.owner.display_name;
                    resourceloc.innerHTML += " - " + this.state.response.description;
                }
            }
        } else {
            if (this.state.response.type != "artist") {
                if (this.state.response.type == "album") {
                    resourceloc.innerHTML = this.state.response.release_date.split('-')[0];
                }
                else if (this.state.response.type == "track") {
                    resourceloc.innerHTML = this.state.response.album.release_date.split('-')[0];
                } else {
                    resourceloc.innerHTML = this.state.response.description;
                }
            }
        }
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
        }, () => {
            // console.log(this.state.uri);
        });
    }

    handleReturnPressed(e) {
        this.clearPoster();
        document.getElementById("customize-page").hidden = true;
        document.getElementById("create-page").hidden = false;
    }

    // Download button
    handleDownload() {
        document.getElementById("poster-paper").style.transform = "scale(1, 1)";

        // Converting html image display into canvas image
        html2canvas(document.getElementById("poster-canvas"), {
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

        this.revealPoster(this.state.response.type);
    }

    // Converts links to URIs
    getURI(inputstring) {
        // If it starts like this don't have to convert link to uri
        if (inputstring.startsWith("spotify:album:") ||
            inputstring.startsWith("spotify:track:") ||
            inputstring.startsWith("spotify:artist:") ||
            inputstring.startsWith("spotify:playlist:")) {
            return inputstring;
        }

        // Validates that it's a link, if not just returns blank string
        try {
            new URL(inputstring);
        } catch (e) {
            return "";
        }

        var splitString = inputstring.split("/");

        return "spotify:" + splitString[3] + ":" + splitString[4];
    }

    // Handles creation and sending of GET request from server
    handleCreateButtonPressed() {
        const requestOptions = {
            method: 'GET',
        };

        var id;
        var type = "blank";
        var uri = this.getURI(this.state.uri);

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
            // handling invalid uri and clearing all the data in the poster
            this.clearPoster();

            this.setState({
                successMsg: "",
                errorMsg: "Invalid URI!",
            });
            return;
        }

        if (type != "blank") {
            try {
                // Execute API calls and handle data
                fetch("/posterise/?id=" + id + "&type=" + type, requestOptions)
                    .then((response) => response.json())
                    .then((response) => {
                        // Handle passed or failed responses
                        console.log(response);
                        // If the response is valid then paint the image
                        if (response.status == 200) {

                            this.setState({
                                includeArtist: false,
                                removeRemastered: false,
                                response: response,
                            }, () => {
                                this.paintImg(JSON.parse(JSON.stringify(this.state.response)));
                            });

                        } else {
                            // handling invalid uri and clearing all the data in the poster if fetch failed
                            this.clearPoster();
                            this.setState({
                                successMsg: "",
                                errorMsg: "Error: " + response.errorMsg,
                            });

                        }
                    });
            } catch (e) {
                this.clearPoster();
                this.setState({
                    successMsg: "",
                    errorMsg: "Error: No response! Try again.",
                });
            }
        }
    }

    // Clears poster data
    clearPoster() {
        // handling invalid uri and clearing all the data in the poster
        document.getElementById("poster-album-art").setAttribute("src", "");
        document.getElementById("poster-resource-title").innerHTML = "";
        document.getElementById("poster-resource-year").innerHTML = "";
        var resourceTracks = document.getElementById("poster-resource-tracks");
        resourceTracks.innerHTML = "";

        document.getElementById("poster-paper").hidden = true;
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

    // This function is responsible for rendering the html elements in the poster
    paintImg(response) {
        // This checks if to remove remastered tags
        if (this.state.removeRemastered && (response.type == "album" || response.type == "track")) {
            // Clearing title section
            const titleSection = document.getElementById("poster-resource-title");
            titleSection.innerHTML = "";

            var splitName = [""];
            // Splitting it by ( and adding first element generally removes remastered sign
            if (response.type == "album") {
                splitName = response.name.split('(');
            } else {
                splitName = response.name.split('-');
            }

            titleSection.innerHTML += splitName[0]

            // This will account for cases where there's more than one () in album title
            for (var i = 1; i < splitName.length - 1; i++) {
                titleSection.innerHTML += "(" + splitName[i];
            }
        } else {
            document.getElementById("poster-resource-title").innerHTML = response.name;
        }

        // Resetting track fontsize
        document.getElementById("poster-resource-tracks").style.fontSize = '24px';

        switch (response.type) {
            case "album":
                // Setting album art
                document.getElementById("poster-album-art").setAttribute("src", response.images[0].url);

                // Setting year style for this type
                document.getElementById("poster-resource-year").style.fontStyle = "normal";
                document.getElementById("poster-resource-year").style.fontWeight = 300;

                // Setting year for this type
                this.handleArtistName();

                // Reveal the document
                this.revealPoster("album");

                // The tracks in the album
                const albumTracks = response.tracks.items;

                // The container for track elements
                var trackContainer = document.getElementById("poster-resource-tracks");
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
                document.getElementById("poster-album-art").setAttribute("src", response.album.images[0].url);

                // Setting year resource styling
                document.getElementById("poster-resource-year").style.fontStyle = "normal";
                document.getElementById("poster-resource-year").style.fontWeight = 300;

                // Setting year resource text
                this.handleArtistName();

                // Clearing the tracklist. Should have other data here
                var trackContainer = document.getElementById("poster-resource-tracks");
                trackContainer.innerHTML = "";

                // Revealing the poster
                this.revealPoster("track");

                break;

            case "artist":
                // Setting album art
                document.getElementById("poster-album-art").setAttribute("src", response.images[0].url);

                // Clearing year resource
                document.getElementById("poster-resource-year").innerHTML = "";

                // Clearing the tracklist. Should have other data here
                var trackContainer = document.getElementById("poster-resource-tracks");
                trackContainer.innerHTML = "";

                // Revealing the poster
                this.revealPoster("artist");

                break;

            case "playlist":
                // Setting album art
                document.getElementById("poster-album-art").setAttribute("src", response.images[0].url);

                // Resetting year resource styling
                document.getElementById("poster-resource-year").style.fontStyle = "normal";
                document.getElementById("poster-resource-year").style.fontWeight = 200;

                // Setting year resource text
                this.handleArtistName();

                // Clearing the tracklist. Should have other data here
                var trackContainer = document.getElementById("poster-resource-tracks");
                trackContainer.innerHTML = "";

                // Revealing the poster
                this.revealPoster("playlist");

                // The tracks in the album
                const playlistTracks = response.tracks.items;

                // The container for track elements
                var trackContainer = document.getElementById("poster-resource-tracks");
                trackContainer.innerHTML = "";

                // Creates track elements in the countainer for each track in the album
                for (var i = 0; i <= 10 && i < playlistTracks.length; i++) {
                    var track = playlistTracks[i].track;
                    if (this.state.removeRemastered) {
                        // Getting name and resetting it
                        var trackname = track.name;
                        track.name = "";

                        // Splitting it by ( and adding first element generally removes remastered sign
                        const splitName = trackname.split('-');

                        track.name += splitName[0]

                        // This will account for cases where there's more than one () in album title
                        for (var j = 1; j < splitName.length - 1; j++) {
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
                }

                // Creating p element with necessary styling and classes.
                var trackline = document.createElement("p");
                var trackname = document.createTextNode("...and more!");
                trackline.appendChild(trackname);
                trackline.style.cssText = "margin-top: -20px; font-style: italic";
                trackline.className += "track-line";


                trackContainer.appendChild(trackline);

                // Make sure that all the tracks fit the container and fix it.
                this.fitTracks(trackContainer);

                break;
        }
        document.getElementById("create-page").hidden = true;
    };

    // Attempts to fit tracks into track container
    fitTracks(trackContainer) {
        // Gets the last child to see if it overflows
        var lastChild = trackContainer.lastChild;
        const canvas = document.getElementById("poster-canvas");

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

    // Shrinks tracks font until reaching minimum font size
    shrinkFont(trackContainer, minFontSize = 0) {
        const lastChild = trackContainer.lastChild;
        const canvas = document.getElementById("poster-canvas");
        var fontSize = parseFloat(window.getComputedStyle(trackContainer, null).getPropertyValue('font-size'));

        // While the last child is overflowing, reduce the font size
        while (this.isOutsideContainer(canvas, lastChild) && fontSize > minFontSize) {
            // Reducing font size by 1
            trackContainer.style.fontSize = (fontSize - 1) + 'px';
            fontSize--;

            // Gets all the children
            var tracklines = trackContainer.children;

            // Sets the children's margin to be a lil bigger after shrinking (looks better)
            for (var i = 0; i < tracklines.length; i++) {
                var trackline = tracklines[i];
                var marginTop = parseFloat(window.getComputedStyle(trackline, null).getPropertyValue('margin-top'));
                trackline.style.marginTop = (marginTop + 1) + 'px';
            }

        }

    }

    // Flips colors for the generated poster
    handleColorChange(e) {
        switch (e.target.value) {
            case "Inverted":
                document.getElementById("poster-canvas").style.backgroundColor = "#2c2b29";
                document.getElementById("poster-resource-title").style.color = "#dcd9d2";
                document.getElementById("poster-resource-year").style.color = "#dcd9d2";
                document.getElementById("poster-resource-tracks").style.color = "#dcd9d2";
                break;
            default:
                document.getElementById("poster-canvas").style.backgroundColor = "#dcd9d2";
                document.getElementById("poster-resource-title").style.color = "#2c2b29";
                document.getElementById("poster-resource-year").style.color = "#2c2b29";
                document.getElementById("poster-resource-tracks").style.color = "#2c2b29";
        }
    }

    handleFlavorTextChange(e) {
        // shouldn't work for albums
        if (this.state.response.type != "album") {
            this.handleFlavorTextRender(e.target.value);
        }
    }

    handleFlavorTextRender(inputText) {
        // Resetting content
        document.getElementById("poster-resource-tracks").innerHTML = "";
        document.getElementById("poster-resource-tracks").style.fontSize = '24px';

        // Similar to track rendering, but with newlines instead
        var lines = inputText.split("\n");
        lines.forEach((line) => {
            var flavorElem = document.createElement("p");
            var flavorText = document.createTextNode(line);
            flavorElem.style.cssText = "flex-basis: 100%; text-align: center; margin-top: -20px;";
            flavorElem.appendChild(flavorText);
            document.getElementById("poster-resource-tracks").appendChild(flavorElem);

            // Shrinks font just like for tracks
            this.shrinkFont(document.getElementById("poster-resource-tracks"));
        });
    }

    // Checks if childDiv is outside the container
    isOutsideContainer(parentDiv, childDiv, border = 20) {
        const parentRect = parentDiv.getBoundingClientRect();
        const childRect = childDiv.getBoundingClientRect();

        return parentRect.bottom - border < childRect.bottom;
    }

    revealPoster(type, scale = 0.8) {
        document.getElementById("create-page").hidden = true;
        const customizePaper = document.getElementById("customize-page");
        customizePaper.hidden = false;

        const posterPaper = document.getElementById("poster-paper");
        posterPaper.hidden = false;
        const userWidth = window.screen.width;

        posterPaper.style.transform = "scale(" + 1 + ")";

        if (userWidth - 48 < posterPaper.getBoundingClientRect().width) {
            scale = (userWidth - 48) / posterPaper.getBoundingClientRect().width;
        } else {
            scale = 0.8
        }

        posterPaper.style.transform = "scale(" + scale + ")";

        if (
            posterPaper.getBoundingClientRect().top > customizePaper.getBoundingClientRect().bottom &&
            !document.body.contains(document.getElementById("scroll-heading"))
        ) {
            // Insert heading saying to scroll for preview if screen is small
            var scrollHeading = document.createElement("h2");
            var scrollText = document.createTextNode("Scroll for preview!");
            scrollHeading.id = "scroll-heading";
            scrollHeading.style.cssText = "flex-basis: 100%; text-align: center; margin-bottom:0;";
            scrollHeading.appendChild(scrollText);

            posterPaper.parentNode.insertBefore(scrollHeading, posterPaper);
        }
        switch (type) {
            case "album":
                this.setState({
                    disallowNameAdd: false,
                    disallowRRemoval: false,
                    disallowFlavor: true,

                    flavorLabel: "Flavor text not supported for albums.",
                    artistLabel: "Include artist",
                });
                break;
            case "track":
                this.setState({
                    disallowNameAdd: false,
                    disallowRRemoval: false,
                    disallowFlavor: false,

                    flavorLabel: "Flavor text",
                    artistLabel: "Include artist",
                });
                this.handleFlavorTextRender(document.getElementById("flavor-text").value);
                break;
            case "artist":
                this.setState({
                    disallowNameAdd: true,
                    disallowRRemoval: true,
                    disallowFlavor: false,

                    flavorLabel: "Flavor text",
                    artistLabel: "Include artist",

                });
                this.handleFlavorTextRender(document.getElementById("flavor-text").value);
                break;
            case "playlist":
                this.setState({
                    disallowNameAdd: false,
                    disallowRRemoval: false,
                    disallowFlavor: true,

                    flavorLabel: "Flavor text not supported for playlists.",
                    artistLabel: "Include creator",
                });
                // this.handleFlavorTextRender(document.getElementById("flavor-text").value);
                break;
        }
    }

    render() {
        return (
            <Grid container rowSpacing={1} >
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
                    pt={7}
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
                                Create A Poster!
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

                                <TextField id="standard-basic" label="URL/URI" variant="standard"
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
                                Create Poster!
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


                                <Tooltip title="Include the artist's name in the poster design!" arrow placement="left">
                                    <FormControlLabel id="include-artist" control={<Switch />} label={this.state.artistLabel}
                                        disabled={this.state.disallowNameAdd} checked={this.state.includeArtist} onChange={this.handleArtistChange} />
                                </Tooltip>

                                <Tooltip title="Remove (Remastered) from track/album names!" arrow placement="left">
                                    <FormControlLabel id="remove-remastered" control={<Switch />} label="Remove Remastered Tags"
                                        disabled={this.state.disallowRRemoval} checked={this.state.removeRemastered} onChange={this.handleRemasteredChange} />
                                </Tooltip>

                                <TextField multiline disabled={this.state.disallowFlavor} id="flavor-text" label={this.state.flavorLabel} variant="standard"
                                    onChange={this.handleFlavorTextChange} />

                            </FormControl>
                        </Grid>

                        <Grid item xs={12} mt={1} pb={2} align="center">
                            <Button color="success" variant="contained" onClick={this.handleDownload}>
                                Download!
                            </Button>
                        </Grid>
                        <Grid item xs={12} pb={6} align="center">
                            <Button color="secondary" variant="outlined" onClick={this.handleReturnPressed}>
                                Return
                            </Button>
                        </Grid>
                    </Paper>

                    <Paper id="poster-paper" mt={-16} p={3} item component={Grid} hidden={true} style={{
                    }}>
                        <Poster />
                    </Paper>

                </Grid>

            </Grid>

        );
    }
}
