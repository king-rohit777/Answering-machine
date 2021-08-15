import React from 'react';

import {Appbar} from './components/Appbar';
import MainContainer from './components/MainContainer';
import {withStyles} from "@material-ui/core/styles";
import styles from "./globalStyle";
import theme from "./Theme";
import {ThemeProvider} from "@material-ui/styles";

// import { Insights } from './insights/Insights';
// import './App.css';

function App({classes}) {
    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <Appbar/>
                {<MainContainer/>}
            </div>
        </ThemeProvider>
    );
}

export default withStyles(styles)(App);
;
