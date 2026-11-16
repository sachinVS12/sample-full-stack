import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        setToken("");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Attach token to all axios requests
  useEffect(() => {
    const id = axios.interceptors.request.use((cfg) => {
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return () => axios.interceptors.request.eject(id);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const { data } = await axios.post(`${API}/api/auth/signup`, {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export const API_BASE = API;
