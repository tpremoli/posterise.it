import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

export default class Examples extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container rowSpacing={1} >
                <style type="text/css" dangerouslySetInnerHTML={{
                    __html:`
                        img{
                            max-width: 100%;
                            margin: 0 auto;
                            max-height: 70vh;
                        }`
                    }}>
                </style>
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
                                Examples
                            </Typography>
                        </Grid>
                        <Grid item xs={12} pt={6} align="center">
                            <Button color="secondary" variant="outlined" to="/" component={Link}>
                                Back to home
                            </Button>
                        </Grid>
                        <Grid item xs={12} pt={6} pb={6} align="center" >
                            <img src="http://posterise.it/static/examples/1999poster.png"></img>
                        </Grid>
                        <Grid item xs={12} pb={6} align="center">
                            <img src="http://posterise.it/static/examples/Abbey%20Road%20(Remastered)poster.png"></img>
                        </Grid>

                        <Grid item xs={12} pb={6} align="center">
                            <img src="http://posterise.it/static/examples/Good%20Will%20Huntingposter.png"></img>
                        </Grid>

                        <Grid item xs={12} pb={6} align="center">
                            <img src="http://posterise.it/static/examples/Infest%20The%20Rats'%20Nestposter.png"></img>
                        </Grid>

                        <Grid item xs={12} pb={6} align="center">
                            <img src="http://posterise.it/static/examples/LP!poster.png"></img>
                        </Grid>

                        <Grid item xs={12} pb={6} align="center">
                            <img src="http://posterise.it/static/examples/Sympathy%20for%20Lifeposter.png"></img>
                        </Grid>

                        <Grid item xs={12} pb={6} align="center">
                            <img src="http://posterise.it/static/examples/Wish%20You%20Were%20Here%20(Remastered%20Version)poster.png"></img>
                        </Grid>

                        <Grid item xs={12} pb={6} align="center">
                            <img src="http://posterise.it/static/examples/thinking%20emojiposter.png"></img>
                        </Grid>

                        <Grid item xs={12} pb={6} align="center">
                            <Button color="secondary" variant="outlined" to="/" component={Link}>
                                Back to home
                            </Button>
                        </Grid>
                    </Paper>
                </Grid >

            </Grid >
        );
    }
}