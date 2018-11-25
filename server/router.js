// -- server/router.js

const express = require("express");
const path = require("path");
const serverRenderer = require("./serverRenderer");

/**
 * Create the router object
 */
const router = express.Router();

// root (/) should always serve our server rendered page
// serverRenderer will be disussed in the next section.
router.use("^/$", serverRenderer());

// Static resources should just be served as they are
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
