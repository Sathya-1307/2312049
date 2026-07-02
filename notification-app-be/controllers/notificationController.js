const { fetchTopNotifications } = require("../services/notificationService");
const { Log } = require("../../logging-middleware/logger");

const getTopNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.params.count) || 10;

    const notifications = await fetchTopNotifications(limit);

    await Log(
      "backend",
      "info",
      "controller",
      "Top notifications fetched successfully."
    );

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    await Log(
      "backend",
      "error",
      "controller",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

module.exports = {
  getTopNotifications,
};