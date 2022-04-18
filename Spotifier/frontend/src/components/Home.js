import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container rowSpacing={1} >
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
                    <Paper id="create-page" width="80vw" item p={3} m={3} component={Grid} >
                        <Grid item xs={12} align="center" width="100%">
                            <Typography component="h1" variant="h1" style={{ fontSize: "300%" }}>
                                Posterise.it!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="center" >
                            <Typography variant="h5" component="span" gutterBottom color="primary">
                                Hello!
                            </Typography>
                            <Typography variant="body1" component="p" gutterBottom>
                                Welcome to Posterise.it!
                            </Typography>
                            <Typography variant="body1" component="p" gutterBottom>
                                This application is a Spotify-based music film-style poster generator.
                            </Typography>
                            <Typography variant="body1" component="p" gutterBottom>
                                We support poster generation for playlists, albums, artists, and tracks.
                            </Typography>
                            <Typography variant="body1" component="p" gutterBottom>
                                There's a great degree of customization to suit all types of needs!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} p={1} align="center">
                            <Button color="success" variant="contained" to="/create-poster" component={Link}>
                                Try it out!
                            </Button>
                        </Grid>
                        <Grid item xs={12} p={1} align="center">
                            <Button color="primary" variant="outlined" to="/about" component={Link}>
                                View Examples
                            </Button>
                        </Grid>
                        <Grid item xs={12} p={1} align="center">
                            <Button color="secondary" variant="outlined" to="/report-bug" component={Link}>
                                Report a bug!
                            </Button>
                        </Grid>
                    </Paper>
                </Grid >

            </Grid >
        );
    }
}