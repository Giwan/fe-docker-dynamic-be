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
