const express = require("express");
const router = express.Router();
const DrainageReport = require("../models/DrainageReport");

// ✅ CREATE (POST)
router.post("/", async (req, res) => {
  try {
    const { name, phone, area, latitude, longitude, message } = req.body;

    if (!name || !phone || !area || !latitude || !longitude || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const report = await DrainageReport.create({
      name,
      phone,
      area,
      latitude,
      longitude,
      message
    });

    res.status(201).json(report);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ ALL (GET)
router.get("/", async (req, res) => {
  try {
    const reports = await DrainageReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ READ ONE (GET by ID)
router.get("/:id", async (req, res) => {
  try {
    const report = await DrainageReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Invalid ID" });
  }
});

// ✅ UPDATE (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, area, latitude, longitude, message } = req.body;

    const updated = await DrainageReport.findByIdAndUpdate(
      req.params.id,
      { name, phone, area, latitude, longitude, message },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE (optional, admin use)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await DrainageReport.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
