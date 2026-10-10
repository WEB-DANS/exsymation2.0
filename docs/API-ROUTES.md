# REST API Route Listing
Prefix: `/api/v1`

| Module | Method | Endpoint | Intended permission |
|---|---|---|---|
| Auth | POST | `/auth/login` | Public |
| Auth | POST | `/auth/refresh` | Refresh token |
| Auth | POST | `/auth/logout` | Authenticated |
| Auth | GET | `/auth/me` | Authenticated |
| Teachers | GET/POST | `/teachers` | Authorized read / Chairman create |
| Teachers | GET/PATCH/DELETE | `/teachers/:id` | Authorized read / Chairman mutations |
| Academic years | GET/POST | `/academic-years` | Authorized read / Chairman write |
| Semesters | GET/POST | `/semesters` | Authorized read / Chairman write |
| Courses | GET/POST | `/courses` | Authorized read / Chairman write |
| Exams | GET/POST | `/exams` | Authorized read / Chairman write |
| Exams | GET/PATCH | `/exams/:id` | Authorized user |
| Committees | GET/POST | `/committees` | Authorized read / Chairman create |
| Committee members | POST | `/committees/:id/members` | Authorized manager |
| Assignments | GET/POST | `/exams/:id/assignments` | Authorized read / Committee Chairman write |
| Assignments | PATCH/DELETE | `/assignments/:id` | Authorized manager |
| Availability | GET | `/availability` | Authorized user |
| Availability | PUT | `/availability/me` | Teacher |
| Exam routines | GET/POST | `/exams/:id/routine` | Authorized read / Committee Chairman write |
| Routines | PATCH | `/routines/:id` | Committee Chairman |
| Routines | POST | `/routines/:id/publish` | Committee Chairman |
| Invigilation | GET/POST | `/exams/:id/invigilation` | Authorized read / Committee Chairman write |
| Proceedings | POST | `/exams/:id/proceedings/generate` | Committee Chairman |
| Proceedings | GET | `/proceedings/me` | Teacher |
| Proceedings | GET | `/proceedings/:id` | Authorized user |
| Proceedings | PATCH | `/proceedings/:id/approve` | Authorized approver |
| Remuneration | GET/POST | `/remunerations/rules` | Authorized read / Chairman write |
| Bills | POST | `/bills/generate` | Teacher, own eligible duties only |
| Bills | GET | `/bills/me` | Teacher |
| Bills | GET | `/bills` | Authorized finance/admin |
| Bills | PATCH | `/bills/:id/status` | Authorized approver |
| Notifications | POST | `/notifications/broadcast` | Chairman |
| Notifications | POST | `/notifications/committee/:id` | Committee Chairman |
| Notifications | GET | `/notifications/me` | Authenticated |
| Notifications | PATCH | `/notifications/:id/read` | Recipient |
| Audit logs | GET | `/audit-logs` | Chairman / auditor |

These are proposed routes. Only health and a small subset of teacher/auth scaffolding are implemented in this starter. Add validation, pagination, resource-level authorization, and tests before production.
