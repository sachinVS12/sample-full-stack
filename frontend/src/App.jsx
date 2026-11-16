import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TableView from "./pages/TableView";
import GraphView from "./pages/GraphView";
import UserManagement from "./pages/UserManagement";
import { useAuth } from "./context/AuthContext";

// Layout with navbar + sidebar (only for logged-in users)
function AppLayout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <div className="main-area">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

      {/* Protected — all logged-in users */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/table"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TableView />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/graph"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GraphView />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin-only */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppLayout>
              <UserManagement />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
