import React, { Component } from "react";
import Examples from "./Examples";
import CreatePoster from "./CreatePoster";
import Home from "./Home";
import ReportPage from "./ReportPage";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Redirect,
} from "react-router-dom";

export default class RouterPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/examples" element={<Examples />} />
                    <Route path="/create-poster" element={<CreatePoster />} />
                    <Route path="/report-bug" element={<ReportPage />} />
                </Routes>
            </Router >
        );
    }
}