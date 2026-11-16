import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function TableView() {
  const [rows, setRows] = useState([]);

  const fetchLatest = async () => {
    const { data } = await axios.get(`${API}/api/sensors/latest`);
    setRows(data);
  };

  useEffect(() => {
    fetchLatest();
    const t = setInterval(fetchLatest, 3000); // poll every 3s
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>📊 Live Sensor Nodes</h1>
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Node Name</th>
              <th>SNR (dB)</th>
              <th>RSSI (dBm)</th>
              <th>Spreading Factor / DR</th>
              <th>Real-Time Value</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 30 }}>
                  Waiting for uplinks… (check backend log)
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const dp = r.decodedPayload || {};
              const realTime = dp.avg ?? dp.realTimeValue ?? dp.batteryV ?? "–";
              return (
                <tr key={r.devEui}>
                  <td>
                    <strong>{r.deviceName}</strong>
                    <br />
                    <small style={{ color: "#64748b" }}>{r.devEui}</small>
                  </td>
                  <td>{r.snr ?? "–"}</td>
                  <td>{r.rssi ?? "–"}</td>
                  <td>{r.dataRate || "–"}</td>
                  <td>
                    <strong style={{ color: "#3b82f6" }}>{realTime}</strong>
                  </td>
                  <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
