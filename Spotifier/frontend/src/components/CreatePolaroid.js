import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/core/Alert";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CreatePolaroid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spotifyAuthenticated: false,
            uri: "blank",
            errorMsg: "",
            is_album: false //Convert to type with string
        }
        this.handleURIChange = this.handleURIChange.bind(this);
        this.handleIsAlbumChange = this.handleIsAlbumChange.bind(this);
        this.handleCreateButtonPressed = this.handleCreateButtonPressed.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.authenticateSpotify();
    }

    handleURIChange(e) {
        this.setState({
            uri: e.target.value,
        });
    }

    handleIsAlbumChange(e) {
        this.setState({
            is_album: e.target.value,
        });
    }

    handleCreateButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uri: this.state.uri,
                is_album: this.state.is_album
            }),
        };

        var id;

        if (uri.startsWith("spotify:album:")) {
        } else if (uri.startsWith("spotify:track:")) {

        } else if (uri.startsWith("spotify:playlist:")) {

        } else if (uri.startsWith("spotify:artist:")) {

        } else {
            this.setState({
                errorMsg: "Invalid URI!",
            });
        }

        fetch("/polaroidize/" + id, requestOptions)
            .then((response) => response.text())
            .then((data) => console.log(data));
    }

    authenticateSpotify() {
        fetch("/is-authenticated").then(res => res.text())
            .then(text => console.log(text));

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
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Include Track Length" />
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Include Artist" />
                        <TextField id="standard-basic" label="URI" variant="standard" onChange={this.handleURIChange} />
                        <RadioGroup
                            row
                            defaultValue="false"
                            onChange={this.handleIsAlbumChange}
                        >
                            <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Album"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel
                                value="false"
                                control={<Radio color="primary" />}
                                label="Track"
                                labelPlacement="bottom"
                            />
                        </RadioGroup>
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
            </Grid>
        );
    }
}
