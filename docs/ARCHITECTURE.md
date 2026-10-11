# Architecture Notes

## Request lifecycle
Client -> Express middleware -> API router -> authentication -> role/resource authorization -> validation -> controller -> service -> Mongoose model -> MongoDB -> JSON response.

## MVC responsibilities
- Models: Mongoose schemas and persistence.
- Views: React frontend; API responses are JSON.
- Controllers: HTTP request/response handling.
- Services: business logic such as scheduling conflict detection, proceedings generation, and remuneration calculation.

## Main domain entities
User, Teacher, Exam, ExamCommittee, ExamRoutine, Proceedings, Bill, Notification.
Recommended additional entities: AcademicYear, Semester, Course, ExaminerAssignment, TeacherAvailability, InvigilationAssignment, RemunerationRule, AuditLog.

## Safeguards
- Never trust role values sent by the browser.
- Enforce committee ownership and record-level permissions in the backend.
- Soft-delete teachers with historical records.
- Prevent overlapping schedule assignments and consider concurrent writes.
- Derive bill items from approved proceedings and versioned remuneration rules.
- Keep secrets out of source control and never expose them through Vite variables.
- Add validation and automated tests to all write endpoints.
