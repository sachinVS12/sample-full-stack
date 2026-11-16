import express from "express";
import Node from "../models/Node.js";

const router = express.Router();

// Create node
router.post("/", async (req, res) => {
  try {
    const { uiId, label, snr, rssi, spreadingFactor, realTimeValue } = req.body;
    const node = await Node.create({
      uiId,
      label,
      snr: snr || 0,
      rssi: rssi || 0,
      spreadingFactor: spreadingFactor || "SF7",
      realTimeValue: realTimeValue || 0,
      history: [{ value: realTimeValue || 0 }],
    });
    res.status(201).json(node);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all nodes
router.get("/", async (req, res) => {
  const nodes = await Node.find().sort({ createdAt: -1 });
  res.json(nodes);
});

// Get single node
router.get("/:id", async (req, res) => {
  const node = await Node.findById(req.params.id);
  if (!node) return res.status(404).json({ error: "Not found" });
  res.json(node);
});

// Update node (simulate real-time value)
router.put("/:id", async (req, res) => {
  const node = await Node.findById(req.params.id);
  if (!node) return res.status(404).json({ error: "Not found" });

  Object.assign(node, req.body);
  if (req.body.realTimeValue !== undefined) {
    node.history.push({ value: req.body.realTimeValue });
    if (node.history.length > 50) node.history.shift();
  }
  await node.save();
  res.json(node);
});

// Delete node
router.delete("/:id", async (req, res) => {
  await Node.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
