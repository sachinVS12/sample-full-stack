import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="sidebar">
      <NavLink to="/" end>
        🏠 Dashboard
      </NavLink>
      <NavLink to="/table">📊 Tabular View</NavLink>
      <NavLink to="/graph">📈 Graph View</NavLink>

      {/* Admin-only */}
      {role === "admin" && (
        <>
          <div
            style={{
              margin: "16px 12px 4px",
              fontSize: 11,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Admin
          </div>
          <NavLink to="/users">👥 User Management</NavLink>
        </>
      )}

      {/* Manager-only hint (optional) */}
      {role === "manager" && (
        <div
          style={{
            margin: "16px 12px",
            padding: "10px 12px",
            background: "#1e293b",
            borderRadius: 8,
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          Manager view — contact admin for user management
        </div>
      )}
    </aside>
  );
}
