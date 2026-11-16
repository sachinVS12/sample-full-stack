import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth, API_BASE } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // Only allow first-time admin signup
  useEffect(() => {
    axios.get(`${API_BASE}/api/auth/needs-setup`).then((r) => {
      if (!r.data.needsSetup) setBlocked(true);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
    setLoading(false);
  };

  if (blocked) {
    return (
      <div style={styles.wrap}>
        <div style={styles.card}>
          <h2 style={{ textAlign: "center", marginBottom: 12 }}>
            🔒 Signup disabled
          </h2>
          <p style={{ textAlign: "center", color: "#64748b" }}>
            An admin already exists. Please <Link to="/login">login</Link>{" "}
            instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.card}>
        <h1 style={styles.title}>🛡️ Create Admin Account</h1>
        <p style={styles.sub}>
          First-time setup — this creates the super admin
        </p>

        <div className="form-group">
          <label>Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Admin Name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="admin@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password (min 6 chars)</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
            placeholder="••••••"
          />
        </div>

        {err && <div style={styles.error}>{err}</div>}

        <button className="btn" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Creating…" : "Create Admin & Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: 12, fontSize: 13 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 36,
    borderRadius: 16,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,.4)",
  },
  title: { textAlign: "center", marginBottom: 6, fontSize: 20 },
  sub: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 24,
    fontSize: 13,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
  },
};
