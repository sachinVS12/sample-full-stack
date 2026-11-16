import express from "express";
import SensorData from "../models/SensorData.js";

const router = express.Router();

// Get latest reading for every device
router.get("/latest", async (req, res) => {
  try {
    const result = await SensorData.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$devEui",
          deviceName: { $first: "$deviceName" },
          devEui: { $first: "$devEui" },
          timestamp: { $first: "$timestamp" },
          rssi: { $first: "$rssi" },
          snr: { $first: "$snr" },
          fPort: { $first: "$fPort" },
          gatewayId: { $first: "$gatewayId" },
          dataRate: { $first: "$dataRate" },
          decodedPayload: { $first: "$decodedPayload" },
          fCnt: { $first: "$fCnt" },
        },
      },
      { $sort: { timestamp: -1 } },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const latest = await SensorData.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$devEui",
          snr: { $first: "$snr" },
          rssi: { $first: "$rssi" },
        },
      },
    ]);

    const totalReadings = await SensorData.countDocuments();
    const activeDevices = latest.length;

    const avgSnr =
      latest.reduce((a, d) => a + (d.snr || 0), 0) / (activeDevices || 1);

    const avgRssi =
      latest.reduce((a, d) => a + (d.rssi || 0), 0) / (activeDevices || 1);

    res.json({
      totalReadings,
      activeDevices,
      avgSnr: Number(avgSnr.toFixed(2)),
      avgRssi: Number(avgRssi.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all readings for a device
router.get("/:devEui", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);

    const data = await SensorData.find({
      devEui: req.params.devEui,
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json(data.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all devices
router.get("/", async (req, res) => {
  try {
    const devices = await SensorData.distinct("devEui");
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
