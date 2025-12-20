const mongoose = require("mongoose");

const DrainageReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("DrainageReport", DrainageReportSchema);
