require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const { swaggerUi, specs } = require("./swagger");

// Inisialisasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Integrasi Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/users", userRoutes);

// Route sederhana
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
