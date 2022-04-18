import React, { Component } from "react";
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
                    </Paper>
                </Grid>

            </Grid>
        );
    }
}