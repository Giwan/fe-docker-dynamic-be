import React from "react";
import { render, hydrate } from "react-dom";
import App from "./App";

const root = document.getElementById("root");
root.hasChildNodes() ? hydrate(<App />, root) : render(<App />, root);
