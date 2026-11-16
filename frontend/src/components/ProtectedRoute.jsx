import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ padding: 40 }}>
        <h2>🚫 Access Denied</h2>
        <p>Your role ({user.role}) cannot view this page.</p>
      </div>
    );
  }
  return children;
}
