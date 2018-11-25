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

require("./server");
