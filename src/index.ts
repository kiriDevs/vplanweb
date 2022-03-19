import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";

const app = React.createElement(App, { key: "entrypoint" }, []);
const strictApp = React.createElement(StrictMode, {}, [app]);
const root = document.getElementById("reactroot");
ReactDOM.render(strictApp, root);
