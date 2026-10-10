import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
export function Login() {
  const { demoLogin } = useAuth(); const navigate = useNavigate();
  function login(role) { demoLogin(role); navigate("/"); }
  return <section className="panel login-panel">
    <p className="eyebrow">DEVELOPMENT PREVIEW</p><h1>Welcome</h1>
    <p>This starter uses demo role selection only. It does not authenticate against the API.</p>
    <div className="button-stack">
      <button onClick={() => login("CHAIRMAN")}>Preview as Chairman</button>
      <button className="secondary" onClick={() => login("COMMITTEE_CHAIRMAN")}>Preview as Exam Committee Chairman</button>
      <button className="secondary" onClick={() => login("TEACHER")}>Preview as Teacher</button>
    </div>
    <p className="warning">Demo login is for UI preview only. Implement real authentication before deployment.</p>
  </section>;
}
