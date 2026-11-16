import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">📡 Sensor Dashboard</div>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.9 }}>
            👤 {user.name}{" "}
            <span
              style={{
                marginLeft: 6,
                padding: "2px 8px",
                borderRadius: 10,
                fontSize: 11,
                background:
                  user.role === "admin"
                    ? "#ef4444"
                    : user.role === "manager"
                      ? "#f59e0b"
                      : "#3b82f6",
                fontWeight: 600,
              }}
            >
              {user.role.toUpperCase()}
            </span>
          </div>
          <button className="btn small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
