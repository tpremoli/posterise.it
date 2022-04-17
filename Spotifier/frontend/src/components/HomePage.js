import React, { Component } from "react";
import AboutPage from "./AboutPage";
import CreatePoster from "./CreatePoster";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={
                        <p>
                            This is the home page
                        </p>
                    } >
                    </Route>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/create-poster" element={<CreatePoster />} />
                </Routes>
            </Router>
        );
    }
}