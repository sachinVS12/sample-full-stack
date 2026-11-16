import { useState } from "react";
import axios from "axios";

export default function NodeForm({ onCreated }) {
  const [form, setForm] = useState({
    uiId: "",
    label: "",
    snr: "",
    rssi: "",
    spreadingFactor: "SF7",
    realTimeValue: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/nodes", form);
      alert("✅ Node created!");
      setForm({
        uiId: "",
        label: "",
        snr: "",
        rssi: "",
        spreadingFactor: "SF7",
        realTimeValue: "",
      });
      onCreated?.();
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-group">
          <label>Device UI ID</label>
          <input
            name="uiId"
            value={form.uiId}
            onChange={handleChange}
            required
            placeholder="DEV-001"
          />
        </div>
        <div className="form-group">
          <label>Label / Node Name</label>
          <input
            name="label"
            value={form.label}
            onChange={handleChange}
            required
            placeholder="Living Room Sensor"
          />
        </div>
        <div className="form-group">
          <label>SNR (dB)</label>
          <input
            type="number"
            step="0.1"
            name="snr"
            value={form.snr}
            onChange={handleChange}
            placeholder="7.5"
          />
        </div>
        <div className="form-group">
          <label>RSSI (dBm)</label>
          <input
            type="number"
            name="rssi"
            value={form.rssi}
            onChange={handleChange}
            placeholder="-95"
          />
        </div>
        <div className="form-group">
          <label>Spreading Factor</label>
          <select
            name="spreadingFactor"
            value={form.spreadingFactor}
            onChange={handleChange}
          >
            {["SF7", "SF8", "SF9", "SF10", "SF11", "SF12"].map((sf) => (
              <option key={sf}>{sf}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Real-Time Value</label>
          <input
            type="number"
            step="0.01"
            name="realTimeValue"
            value={form.realTimeValue}
            onChange={handleChange}
            placeholder="25.4"
          />
        </div>
      </div>
      <button className="btn" disabled={loading}>
        {loading ? "Creating..." : "Create Node"}
      </button>
    </form>
  );
}
