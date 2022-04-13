import React, { Component } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import HomePage from "./HomePage";
import { CssBaseline } from "@mui/material";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <HomePage />
                </CssBaseline>
            </ThemeProvider>
        );
    }
}


const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#b79302',
        },
        secondary: {
            main: '#d61216',
        },
        background: {
            default: '#d0ccc4',
            paper: '#f7f2eb',
        },
        error: {
            main: "#E44949",
        },
        success: {
            main: "#42CA42",
        },
        info: {
            main: '#508ebf',
        },
    },
});

const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(<App tab="/" />);