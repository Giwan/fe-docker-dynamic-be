/**
 * (pre)Load the necessary libraries to ensure
 * the react app can be built on the server.
 * -- Normally these are loaded by webpack --
 */
require("ignore-styles");
require("url-loader");
require("file-loader");
require("@babel/polyfill");
require("@babel/register")({
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-export-default-from"
    ]
});

/** --- Now load the application as normal --- */

const express = require("express");
const router = require("./router");

// Initiate App
const app = express();
const { PORT = 3000 } = process.env; // default to 3000

/**
 * Tell the app to use the router imported above
 */
app.use(router);

// start the express server and log what port it's running on
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`));
