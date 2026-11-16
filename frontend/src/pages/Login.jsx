import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth, API_BASE } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/auth/needs-setup`)
      .then((r) => setNeedsSetup(r.data.needsSetup))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.card}>
        <h1 style={styles.title}>📡 Sensor Dashboard</h1>
        <p style={styles.sub}>Sign in to continue</p>

        {needsSetup && (
          <div style={styles.info}>
            🔧 No admin exists yet.{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: 600 }}>
              Create the first admin →
            </Link>
          </div>
        )}

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
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            placeholder="••••••"
          />
        </div>

        {err && <div style={styles.error}>{err}</div>}

        <button className="btn" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>

        {needsSetup && (
          <p style={{ textAlign: "center", marginTop: 12, fontSize: 13 }}>
            First time? <Link to="/signup">Create admin account</Link>
          </p>
        )}
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
  title: { textAlign: "center", marginBottom: 6, fontSize: 22 },
  sub: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 24,
    fontSize: 14,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
  },
  info: {
    background: "#dbeafe",
    color: "#1e40af",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 12,
  },
};
