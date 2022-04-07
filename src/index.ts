import React, { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";

const app = React.createElement(App, { key: "entrypoint" }, []);

const fallbackUi = React.createElement("p", {}, "Loading...");

const app = React.createElement(App, { key: "#" }, []);
const strictApp = React.createElement(StrictMode, { key: "strict#" }, [app]);
const suspendableApp = React.createElement(Suspense, { fallback: fallbackUi }, [strictApp]);
const root = document.getElementById("reactroot");

ReactDOM.render(suspendableApp, root);
