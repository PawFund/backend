const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    email: { type: String, required: true },
    social: { type: String, required: true },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
