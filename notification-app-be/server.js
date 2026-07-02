require("dotenv").config();

const express = require("express");

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(express.json());

app.use("/api", notificationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notification Priority API is running.",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});