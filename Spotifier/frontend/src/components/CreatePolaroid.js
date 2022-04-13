import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/core/Alert";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ScrollDialog from "./URIHelpDialog.js";
// import domtoimage from 'dom-to-image';

export default class CreatePolaroid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotifyAuthenticated: false,
            uri: "blank",
            errorMsg: "",
            successMsg: "",
            imgURL: "",
        }
        this.handleURIChange = this.handleURIChange.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
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
                        // print(response);
                        this.setState({
                            imgURL: response.images[0].url,
                        });
                    } else {
                        this.setState({
                            errorMsg: "Error: " + response.errorMsg,
                            imgURL: "",
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
                // console.log(data.status);
                if (!data.status) {
                    fetch("/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    }



    render() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Collapse
                        in={this.state.errorMsg != ""}
                    >
                        <Alert
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
                            severity="success"
                            onClose={() => {
                                this.setState({ successMsg: "" });
                            }}
                        >
                            {this.state.successMsg}
                        </Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Create A Polaroid!
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">

                        <FormHelperText>
                            <div align="center">
                                Options
                            </div>
                        </FormHelperText>

                        <Tooltip title="Include the length of the album/track/playlist in the polaroid design!" arrow placement="right">
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Include Length" />
                        </Tooltip>
                        <Tooltip title="Include the artist's name in the polaroid design!" arrow placement="right">
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Include Artist" />
                        </Tooltip>
                        <Tooltip title="Remove (Remastered) from track/album names!" arrow placement="right">
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Include Remastered" />
                        </Tooltip>
                        <TextField id="standard-basic" label="URI" variant="standard" onChange={this.handleURIChange} />

                        <ScrollDialog />

                    </FormControl>
                </Grid>

                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.handleCreateButtonPressed}
                    >
                        Create Polaroid!
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="outlined" to="/" component={Link}>
                        Back to home
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <img src={this.state.imgURL}>

                    </img>
                </Grid>
            </Grid>
        );
    }
}

