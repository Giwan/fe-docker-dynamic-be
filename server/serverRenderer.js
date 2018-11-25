// serverRenderer.js

const React = require("react");
const { renderToString } = require("react-dom/server"); // renders react app to string
// const App = require("../src/App"); // import the app that is going to be rendered on the server
const fs = require("fs");
const path = require("path");
const { API_HOST = "http://fallbackapihost.com" } = process.env;
import App from "../src/App";

const indexFilePath = path.resolve(__dirname, "..", "build", "index.html");

const serverRenderer = () => async ({}, response) => {
    // read the public/index.html file into memory
    // The rendered html string is then inserted
    // and sent to the client
    fs.readFile(indexFilePath, "utf8", (err, indexHTMLFile) => {
        if (err) {
            console.error("Failed to read index.html ", err);
            return response.status(404).end();
        }

        // Render the entire React app to HTML string
        const renderedHTML = renderToString(<App apiHost={API_HOST} />);

        // Add (Global) variable with data to
        // the client window object
        const initialData = `
            <script>
                window.__API_HOST__ = "${API_HOST}"
            </script>
        `;

        return response.send(
            indexHTMLFile.replace(
                '<div id="root"></div>',
                `<div id="root">${renderedHTML}</div>${initialData}`
            )
        );
    });
};

module.exports = serverRenderer;
