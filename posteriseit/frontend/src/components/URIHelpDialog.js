import * as React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function URIHelpDialog() {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button onClick={handleClickOpen('paper')} color="info">What's this?</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">What's this about?</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        component="div"
                        color="text"
                    >
                        <Typography variant="h5" component="span" gutterBottom color="primary">
                            <b>Hello!</b>
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            URLs and URIs can be used to identify resources on Spotify!
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            This app allows you to use Albums, Tracks, Playlists, and Artists.
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            To get one of these, simply open Spotify and find your desired resource from the above options 
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            Press on the three dots, go to share, and press "copy link".
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            Paste it in the text box to create a Poster for that resource!
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>
                            Here's a few examples:
                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>

                            <Tooltip title="Copy to clipboard" arrow placement="left">
                                <IconButton aria-label="copy-sample-album"
                                    onClick={() =>
                                        navigator.clipboard.writeText("spotify:album:0ETFjACtuP2ADo6LFhL6HN")
                                    }
                                >
                                    <ContentCopyIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            Album: <code style={{wordWrap: "break-word"}}>spotify:album:0ETFjACtuP2ADo6LFhL6HN </code>

                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>

                            <Tooltip title="Copy to clipboard" arrow placement="left">
                                <IconButton aria-label="copy-sample-album"
                                    onClick={() =>
                                        navigator.clipboard.writeText("spotify:track:4cOdK2wGLETKBW3PvgPWqT")
                                    }
                                >
                                    <ContentCopyIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            Track: <code style={{wordWrap: "break-word"}}>spotify:track:4cOdK2wGLETKBW3PvgPWqT</code>

                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>

                            <Tooltip title="Copy to clipboard" arrow placement="left">
                                <IconButton aria-label="copy-sample-album"
                                    onClick={() =>
                                        navigator.clipboard.writeText("spotify:artist:0k17h0D3J5VfsdmQ1iZtE9")
                                    }
                                >
                                    <ContentCopyIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            Artist: <code style={{wordWrap: "break-word"}}>spotify:artist:0k17h0D3J5VfsdmQ1iZtE9</code>

                        </Typography>
                        <Typography variant="body1" component="p" gutterBottom>

                            <Tooltip title="Copy to clipboard" arrow placement="left">
                                <IconButton aria-label="copy-sample-album"
                                    onClick={() =>
                                        navigator.clipboard.writeText("spotify:playlist:2DFRAWTSAuiqdikofkLJ3F")
                                    }
                                >
                                    <ContentCopyIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            Playlist: <code style={{wordWrap: "break-word"}}>spotify:playlist:2DFRAWTSAuiqdikofkLJ3F</code>

                        </Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Thanks!</Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    function copyText(uriString) {
        navigator.clipboard.writeText(uriString);
    }
}

