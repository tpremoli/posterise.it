import React, { Component } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

export default class ReportPage extends Component {
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
                                Report Page (To be implemented)
                            </Typography>
                        </Grid>
                        <Grid item xs={12} pb={6} align="center">
                            <Button color="secondary" variant="outlined" to="/" component={Link}>
                                Back to home
                            </Button>
                        </Grid>
                    </Paper>
                </Grid>

            </Grid>
        );
    }
}