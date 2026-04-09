const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/messageController");

router.get("/messages", getMessages);

router.get("/health", (_req, res) => res.json({ status: "ok" }));

module.exports = router;
