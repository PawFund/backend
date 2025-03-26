const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    contractAddress: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    typeAnimal: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: "campaigns" }
);

module.exports = mongoose.model("Campaign", campaignSchema);
