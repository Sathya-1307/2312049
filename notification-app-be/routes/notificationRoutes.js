const express = require("express");

const router = express.Router();

const {
  getTopNotifications,
} = require("../controllers/notificationController");

router.get("/notifications/top/:count", getTopNotifications);

module.exports = router;