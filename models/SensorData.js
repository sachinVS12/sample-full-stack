import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  deviceName: String,
  devEui: String,
  timestamp: Date,
  rssi: Number,
  snr: Number,
  fPort: Number,
  gatewayId: String,
  dataRate: String,
  decodedPayload: mongoose.Schema.Types.Mixed,
  fCnt: Number,
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);

export default SensorData;
