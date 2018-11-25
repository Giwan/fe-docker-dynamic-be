import React from "react";
import { render, hydrate } from "react-dom";
import "./index.css";
import App from "./App";

const apiHost = window.__API_HOST__;
const root = document.getElementById("root");

/**
 * If childNodes exist, then server rendering
 * happened and we only need to hydrate
 */
root.hasChildNodes()
    ? hydrate(<App apiHost={apiHost} />, root)
    : render(<App apiHost={apiHost} />, root);
