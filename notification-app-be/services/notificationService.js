const axios = require("axios");
const { Log } = require("../../logging-middleware/logger");
const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const fetchTopNotifications = async (limit = 10) => {
  try {
    const response = await axios.get(process.env.NOTIFICATION_API, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const notifications =
      response.data.notifications ||
      response.data.data ||
      response.data;

    const unreadNotifications = notifications.filter(
      (notification) => notification.isRead === false
    );

    unreadNotifications.sort((a, b) => {
      const priorityA =
        priorityMap[a.type || a.notificationType] || 0;

      const priorityB =
        priorityMap[b.type || b.notificationType] || 0;

      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      const dateA = new Date(a.createdAt || a.timestamp);
      const dateB = new Date(b.createdAt || b.timestamp);

      return dateB - dateA;
    });

    const topNotifications = unreadNotifications.slice(0, limit);

    await Log(
      "backend",
      "info",
      "service",
      "Fetched top unread notifications successfully."
    );

    return topNotifications;
  } catch (error) {
    await Log(
      "backend",
      "error",
      "service",
      error.message
    );

    throw error;
  }
};

module.exports = {
  fetchTopNotifications,
};