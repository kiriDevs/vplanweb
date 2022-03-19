import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

const app = React.createElement(App, {}, []);
const root = document.getElementById("reactroot");
ReactDOM.render(app, root);
