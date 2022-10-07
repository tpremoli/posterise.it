import React from "react";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';

export default function ToggleAlignment(props) {
    const [alignment, setAlignment] = React.useState('left');

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            document.getElementById("poster-resource-tracks").style.textAlign = newAlignment;
        }
    };

    return (
        <Box textAlign='center'>
            <ToggleButtonGroup
                align="center"
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
            >
                <ToggleButton value="left">
                    <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center">
                    <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right">
                    <FormatAlignRightIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}