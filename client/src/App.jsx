import { Link, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Login } from "./pages/Login.jsx";
import { useAuth, AuthProvider } from "./context/AuthContext.jsx";

function Shell() {
  const { user, logout } = useAuth();
  return <div className="app-shell">
    <header className="topbar"><Link className="brand" to="/">University Exam Management</Link>
      <nav>{user ? <><span>{user.name} · {user.role}</span><button onClick={logout}>Log out</button></> : <Link to="/login">Log in</Link>}</nav>
    </header>
    <main className="main"><Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path="/unauthorized" element={<section className="panel"><h1>Access denied</h1><p>You do not have permission to view this page.</p></section>}/>
      <Route path="*" element={<section className="panel"><h1>Page not found</h1><Link to="/">Return to dashboard</Link></section>}/>
    </Routes></main>
    <footer>University Department Exam Management System · Starter scaffold</footer>
  </div>;
}
export default function App() { return <AuthProvider><Shell/></AuthProvider>; }
