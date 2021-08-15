import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1A1A1A'
        },
        secondary: {
            main: '#E3A019'
        }
    },
    root: {
        flexGrow: 1
    },
    button: {
    },
    paper: {
        padding: 24
    },
    typography: {
        fontFamily: 'Poppins',
        body1: {
            fontSize: '0.875rem'
        },
        button: {
            fontSize: '1rem',
        },
    },
    overrides: {
        MuiInputBase: {
            input: {
                background: '#EEEEEE',
                fontSize: '0.875rem',
                padding: '10px 15px 11px 14px'
            }
        },
        MuiFormLabel: {
            root: {
                paddingBottom: 5,
                fontSize: '0.875rem',
                color: '#000000'
            }
        }
    }
});

export default theme;