const express = require("express");
const router = express.Router();

const { getUrl, shortenUrl } = require("../services/short");

router.post("/shorten", shortenUrl);
router.get("/:shortenUrl", getUrl);

module.exports = router;
