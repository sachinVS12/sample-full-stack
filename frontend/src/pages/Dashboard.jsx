import { useEffect, useState } from "react";
import axios from "axios";
const API = "http://localhost:5000";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [s, l] = await Promise.all([
        axios.get(`${API}/api/sensors/stats/summary`),
        axios.get(`${API}/api/sensors/latest`),
      ]);
      setStats(s.data);
      setLatest(l.data);
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>🏠 Live Dashboard</h1>
      <div className="grid">
        <div className="stat">
          <div className="label">Active Devices</div>
          <div className="value">{stats.activeDevices ?? 0}</div>
        </div>
        <div className="stat">
          <div className="label">Total Readings</div>
          <div className="value">{stats.totalReadings ?? 0}</div>
        </div>
        <div className="stat">
          <div className="label">Avg SNR</div>
          <div className="value">{stats.avgSnr ?? 0} dB</div>
        </div>
        <div className="stat">
          <div className="label">Avg RSSI</div>
          <div className="value">{stats.avgRssi ?? 0} dBm</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Uplinks</h2>
        <ul style={{ listStyle: "none" }}>
          {latest.map((d) => (
            <li
              key={d.devEui}
              style={{ padding: "10px 0", borderBottom: "1px solid #e2e8f0" }}
            >
              <strong>{d.deviceName}</strong>{" "}
              <small style={{ color: "#64748b" }}>({d.devEui})</small> — SNR:{" "}
              {d.snr} dB · RSSI: {d.rssi} dBm
              <span style={{ float: "right", color: "#64748b", fontSize: 12 }}>
                {new Date(d.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
          {latest.length === 0 && <li>Waiting for first uplink…</li>}
        </ul>
      </div>
    </div>
  );
}
