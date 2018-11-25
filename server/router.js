// -- server/router.js

const express = require("express");
const path = require("path");
const serverRenderer = require("./serverRenderer");

/**
 * Create the router object
 */
const router = express.Router();

/**
 * this route will not be used with serverside rendering
 * working properly.
 * However getting this route will require an additional
 * request to be sent to the server.
 */
router.get("/environment.json", ({}, response) => {
    response.json({
        apiHost: "http://somehost.com"
    });
});

// root (/) should always serve our server rendered page
// serverRenderer will be disussed in the next section.
router.use("^/$", serverRenderer());

// Static assests should just be accessible
router.use(
    express.static(path.resolve(__dirname, "..", "build"), {
        maxAge: "30d"
    })
);

/**
 * Ensures the front-end source and assets are still
 * found if the user refreshes the page on a deep route:
 * /book/com.mytoori.book.sample4
 * If this route is not here the front-end assets are not found
 */
router.use("^(?!api$)", serverRenderer());

module.exports = router;
