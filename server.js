const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// App
const app = express();
const { PORT = 3000 } = process.env;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/env.json", ({}, response) => {
  response.json({ apiHost: process.env.API_HOST });
});

/**
 * ensure build folder is served on root request
 */
app.use("^/$", express.static("build"));

/**
 * ensures the static resources are found after loading the file on /
 */
app.use(express.static(path.resolve(__dirname, "build")));

/**
 * If we make it to this point it's because the route is not
 * found in which case we should just load the front-end
 * except if it's an api request.
 */
app.use("^(?!api)", express.static("build"));

// start the server
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`));
