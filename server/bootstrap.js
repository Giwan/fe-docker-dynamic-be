/**
 * (pre)Load the necessary libraries to ensure
 * the react app can be built on the server.
 * -- Normally these are loaded by webpack --
 */
require("ignore-styles");
require("url-loader");
require("file-loader");
require("babel-register")({
    presets: ["babel-preset-es2015", "babel-preset-react-app"],
    plugins: ["syntax-dynamic-import", "dynamic-import-node"]
});

require("./server");
