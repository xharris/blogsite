import React from "react";
import ReactDOM from "react-dom";
import "typeface-roboto";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { re } from "@util";

import MediaView from "@page/mediaview";

if (window.location.pathname.search(re.media_url_id) > -1) {
  ReactDOM.render(<MediaView />, document.body); // doesn't work properly
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
