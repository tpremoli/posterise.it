import React, { Component } from "react";
import AboutPage from "./AboutPage";
import CreatePolaroid from "./CreatePolaroid";
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
                    <Route path="/create-polaroid" element={<CreatePolaroid />} />
                </Routes>
            </Router>
        );
    }
}