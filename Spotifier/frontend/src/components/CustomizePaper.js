import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { Paper, RadioGroup } from "@mui/material";
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CustomizePaper(props) {

    if(props.hidden){
        return;
    }

    return (
        <Paper id="customize-page" item pt={6} xs={3} component={Grid} mr={4}>
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

                    <RadioGroup row label="Color scheme" defaultValue="Default">
                        <FormControlLabel control={<Radio />} value="Default" label="Default" />
                        <FormControlLabel control={<Radio />} value="Inverted" label="Inverted" />
                        <Tooltip title="Not yet implemented!" arrow placement="right">
                            <FormControlLabel disabled control={<Radio />} value="Sample" label="Color sample" />
                        </Tooltip>
                    </RadioGroup>

                    <Tooltip title="Include the artist's name in the polaroid design!" arrow placement="left">
                        <FormControlLabel disabled control={<Switch />} label="Include Artist"
                        />
                        {/* onChange={super(this.handleArtistChange} */}
                    </Tooltip>

                    <Tooltip title="Include the length of the album/track/playlist in the polaroid design!" arrow placement="left">
                        <FormControlLabel disabled control={<Switch />} label="Include Length" />
                    </Tooltip>

                    <Tooltip title="Limits tracklist to one song per line" arrow placement="left">
                        <FormControlLabel disabled control={<Switch />} label="One track per line" />
                    </Tooltip>

                    <Tooltip title="Remove (Remastered) from track/album names!" arrow placement="left">
                        <FormControlLabel control={<Switch />} label="Remove Remastered Tags" />
                        {/* onChange={this.handleRemasteredChange} */}
                    </Tooltip>


                </FormControl>
            </Grid>

            <Grid item xs={12} pb={2} align="center">
                <Button
                    color="success"
                    variant="contained"
                >
                    Download poster!
                </Button>
            </Grid>
            <Grid item xs={12} pb={6} align="center">
                <Button color="secondary" variant="outlined" to="/" component={Link}>
                    Return
                </Button>
            </Grid>
        </Paper>
    );

}

