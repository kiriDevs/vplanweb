import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";

import "./services/i18n";

const fallbackUi = React.createElement("p", {}, "Loading...");

const app = React.createElement(App, { key: "#" }, []);
const strictApp = React.createElement(StrictMode, { key: "strict#" }, [app]);
const suspendableApp = React.createElement(Suspense, { fallback: fallbackUi }, [strictApp]);

const container = document.getElementById("reactroot")!;
const root = createRoot(container);

root.render(suspendableApp);
