import {Paper, Typography} from "@material-ui/core";
import React from "react";
import {withStyles} from "@material-ui/core/styles";
import styles from "../../globalStyle";
import {ThemeProvider} from "@material-ui/styles";
import theme from "../../Theme";

const LiveTranscript = ({transcriptResponse, classes}) => {
    return (
        <ThemeProvider theme={theme}>
            <Paper variant={"outlined"} className={classes.paper} style={{
                marginBottom: 15,
                width: '100%'
            }}>

                <Typography variant={"h6"} style={{marginBottom: 15, paddingBottom: 10}}>
                    Live Captioning
                </Typography>
                <Typography>
                    {
                        transcriptResponse && transcriptResponse.payload.content ?
                            (<Typography variant={"body1"} style={{color: 'gray'}}>
                                {transcriptResponse.payload.content}
                            </Typography>) :

                            (<Typography variant={"body1"} style={{color: 'gray'}}>
                                Live captioning will appear here ...
                            </Typography>)
                    }
                </Typography>
            </Paper>
        </ThemeProvider>
    );
};

export default withStyles(styles)(LiveTranscript);