const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },          // Step 1: Click counter
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }                      // Step 3: Optional expiration
});

module.exports = mongoose.model("Url", urlSchema);
