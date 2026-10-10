import { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem("demoUser")); } catch { return null; } });
  function demoLogin(role) {
    const next = { name: role === "CHAIRMAN" ? "Department Chairman" : role === "COMMITTEE_CHAIRMAN" ? "Exam Committee Chairman" : "Teacher", role };
    sessionStorage.setItem("demoUser", JSON.stringify(next)); setUser(next);
  }
  function logout() { sessionStorage.removeItem("demoUser"); setUser(null); }
  const value = useMemo(() => ({ user, demoLogin, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
