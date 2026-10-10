import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
const cards = {
  CHAIRMAN: [["Teachers","Manage department teacher records.","/chairman/teachers"],["Examinations","Manage exams across semesters.","/chairman/exams"],["Committees","Manage examination committees.","/chairman/committees"],["Remuneration","Configure rates and oversee bills.","/chairman/remuneration-rules"],["Notifications","Notify all teachers.","/chairman/notifications"]],
  COMMITTEE_CHAIRMAN: [["Assignments","Assign examiner responsibilities.","/committee/assignments"],["Exam routines","Prepare routines and check conflicts.","/committee/routines"],["Invigilation","Allocate invigilation duties.","/committee/invigilation"],["Proceedings","Generate examination proceedings.","/committee/proceedings"]],
  TEACHER: [["My routines","View examination and invigilation duties.","/teacher/routines"],["My proceedings","Review examination responsibilities.","/teacher/proceedings"],["My bills","Review remuneration bills.","/teacher/bills"],["Notifications","View announcements.","/teacher/notifications"]]
};
export function Dashboard() {
  const { user } = useAuth();
  return <div><div className="hero"><p className="eyebrow">DASHBOARD</p><h1>Hello, {user?.name}</h1><p>Manage examination workflows from committee formation through scheduling, proceedings, and remuneration.</p></div>
    <div className="card-grid">{(cards[user?.role] || []).map(([title, desc, path]) => <article className="feature-card" key={title}><h2>{title}</h2><p>{desc}</p><Link to={path}>Open module →</Link><small>UI placeholder — implementation required</small></article>)}</div>
  </div>;
}
