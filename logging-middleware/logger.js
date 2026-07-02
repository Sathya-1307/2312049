const axios = require("axios");
require("dotenv").config();

async function Log(stack, level, packageName, message) {
  try {
    const response = await axios.post(
      process.env.LOG_API,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Logger Error");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

module.exports = { Log };