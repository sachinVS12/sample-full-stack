import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API = "http://localhost:5000";

export default function GraphView() {
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState("");
  const [history, setHistory] = useState([]);

  // Load device list
  useEffect(() => {
    axios.get(`${API}/api/sensors/latest`).then(({ data }) => {
      setDevices(data);
      if (data.length && !selected) setSelected(data[0].devEui);
    });
  }, []);

  // Load history for selected device — refresh every 3s
  useEffect(() => {
    if (!selected) return;
    const load = async () => {
      const { data } = await axios.get(
        `${API}/api/sensors/${selected}?limit=100`,
      );
      const points = data.map((r) => ({
        time: new Date(r.timestamp).toLocaleTimeString(),
        value: r.decodedPayload?.avg ?? r.decodedPayload?.batteryV ?? 0,
        snr: r.snr ?? 0,
        rssi: r.rssi ?? 0,
      }));
      setHistory(points);
    };
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [selected]);

  const active = devices.find((d) => d.devEui === selected);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>📈 Live Graph</h1>

      <div className="card">
        <div className="form-group" style={{ maxWidth: 320 }}>
          <label>Select Node</label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">-- choose --</option>
            {devices.map((d) => (
              <option key={d.devEui} value={d.devEui}>
                {d.deviceName} ({d.devEui})
              </option>
            ))}
          </select>
        </div>
      </div>

      {active && (
        <>
          <div className="grid">
            <div className="stat">
              <div className="label">SNR</div>
              <div className="value">{active.snr} dB</div>
            </div>
            <div className="stat">
              <div className="label">RSSI</div>
              <div className="value">{active.rssi} dBm</div>
            </div>
            <div className="stat">
              <div className="label">Data Rate</div>
              <div className="value">{active.dataRate || "–"}</div>
            </div>
            <div className="stat">
              <div className="label">FCnt</div>
              <div className="value">{active.fCnt ?? "–"}</div>
            </div>
          </div>

          <div className="card">
            <h2>Value History (last 100 readings)</h2>
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Value"
                />
                <Line
                  type="monotone"
                  dataKey="snr"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="SNR"
                />
                <Line
                  type="monotone"
                  dataKey="rssi"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="RSSI"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
