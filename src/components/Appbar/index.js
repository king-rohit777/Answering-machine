import React from 'react'
import {AppBar, Toolbar, IconButton, Typography} from '@material-ui/core'
import VoicemailIcon from '@material-ui/icons/Voicemail';

export function Appbar() {
    return (
        <AppBar position="static"
                color={"primary"}
                variant={"outlined"}

        >
            <Toolbar variant="regular">
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <VoicemailIcon/>
                </IconButton>
                <Typography variant="h6" color="inherit">
                    Live Demo
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
