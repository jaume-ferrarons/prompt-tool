import React, { useState } from "react";

import {
    Box,
    IconButton,
    Dialog,
    DialogActions,
    Button,
    Stack,
    Link,
    Fade
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import PageviewIcon from '@mui/icons-material/Pageview';

const ImageView = ({ src, alt, size }) => {
    const [open, setOpen] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleMouseEnter = () => setIsHover(true);
    const handleMouseLeave = () => setIsHover(false);

    return <>
        <div onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                position: "relative",
                display: "inline-block",
            }}>
            <Fade in={isHover}>
                <Stack direction="row" alignItems="center" sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    backgroundColor: '#00000066',
                    padding: 0.2
                }} className="hidden-buttons">
                    <Box flexGrow={1} />
                    <Link href={src} download="image.jpeg">
                        <IconButton color="primary">
                            <DownloadIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={handleOpen} color="primary">
                        <PageviewIcon />
                    </IconButton>
                </Stack>
            </Fade>
            <img src={src} alt={alt} style={{ "max-width": size, "max-height": size }} />
        </div>
        <Dialog open={open} onClose={handleClose}>
            <img src={src} alt={alt} />
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    </>;
}

export default ImageView;