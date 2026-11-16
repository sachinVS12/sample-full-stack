import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema(
  {
    uiId: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    snr: { type: Number, default: 0 },
    rssi: { type: Number, default: 0 },
    spreadingFactor: { type: String, default: "SF7" },
    realTimeValue: { type: Number, default: 0 },
    history: [
      {
        value: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Node", nodeSchema);
