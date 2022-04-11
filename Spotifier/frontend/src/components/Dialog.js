import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ScrollDialog() {
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
            <Button onClick={handleClickOpen('paper')}>What's this?</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">What's a URI and how do I get it?</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {/* Add gifs. Add line breaks. Typography? */}
                            Hello!
                            A URI is a <b>Unique Resource Identifier.</b>It can be used to identify a resource on Spotify!
                            This app allows you to use Albums, Tracks, Playlists, and Artists.
                            To get a URI, open Spotify and find your desired resource from the above options.
                            Right click on that resource, and move your mouse to the <i>share</i> option.
                            Hold <code>ctrl</code> or <code>alt</code>, and click <b>'Copy Spotify URI'</b>
                            Paste it in the text box to create a Polaroid!
                            Here's an example of a URI.
                            Album: spotify:album:0ETFjACtuP2ADo6LFhL6HN
                            Track: spotify:track:4cOdK2wGLETKBW3PvgPWqT
                            Artist: spotify:artist:0k17h0D3J5VfsdmQ1iZtE9
                            Playlist: ??
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Thanks!</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}