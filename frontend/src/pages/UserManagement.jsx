import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../context/AuthContext";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await axios.get(`${API_BASE}/api/users`);
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/users`, form);
      setForm({ name: "", email: "", password: "", role: "user" });
      load();
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
    setLoading(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`${API_BASE}/api/users/${id}`);
    load();
  };

  const toggle = async (id, active) => {
    await axios.patch(`${API_BASE}/api/users/${id}`, { active: !active });
    load();
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>👥 User Management</h1>

      <div className="card">
        <h2>Create Manager or User</h2>
        <form onSubmit={create}>
          <div
            className="grid"
            style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div className="form-group">
              <label>Full Name</label>
              <input
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password (min 6)</label>
              <input
                type="password"
                value={form.password}
                required
                minLength={6}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User (read-only)</option>
                <option value="manager">Manager (view + manage sensors)</option>
              </select>
            </div>
          </div>
          {err && (
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: 10,
                borderRadius: 8,
                marginBottom: 12,
                fontSize: 13,
              }}
            >
              {err}
            </div>
          )}
          <button className="btn" disabled={loading}>
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <strong>{u.name}</strong>
                </td>
                <td>{u.email}</td>
                <td>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      background:
                        u.role === "admin"
                          ? "#fee2e2"
                          : u.role === "manager"
                            ? "#fef3c7"
                            : "#dbeafe",
                      color:
                        u.role === "admin"
                          ? "#991b1b"
                          : u.role === "manager"
                            ? "#92400e"
                            : "#1e40af",
                      fontWeight: 600,
                    }}
                  >
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td>{u.active ? "✅ Active" : "❌ Disabled"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.role !== "admin" && (
                    <>
                      <button
                        className="btn small"
                        onClick={() => toggle(u._id, u.active)}
                      >
                        {u.active ? "Disable" : "Enable"}
                      </button>{" "}
                      <button
                        className="btn small danger"
                        onClick={() => remove(u._id)}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
