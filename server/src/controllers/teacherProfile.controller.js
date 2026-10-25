import mongoose from "mongoose";

import Teacher from "../models/teacher.model.js";
import Session from "../models/session.model.js";
import CourseAssignment from "../models/courseAssignment.model.js";
import ExamCommittee from "../models/examCommittee.model.js";
import Routine from "../models/routine.model.js";
import DepartmentChairman from "../models/departmentChairman.model.js";
import { getRoles } from "../services/roles.service.js";
import { writeAudit } from "../utils/audit.js";
import { decrypt } from "../utils/crypto.util.js";
import { maskNid } from "../utils/mask.js";
import { cleanObject } from "../utils/sanitize.js";
import { startOfDayInTZ } from "../utils/timezone.js";

const COMMITTEE_SLOTS = [
  ["chairman", "Chairman"],
  ["member1", "Member 1"],
  ["member2", "Member 2"],
  ["tabulator1", "Tabulator 1"],
  ["tabulator2", "Tabulator 2"],
];

function teacherIdOf(value) {
  if (!value) return null;
  return String(value._id || value);
}

function examinerRole(assignment, teacherId) {
  const id = String(teacherId);
  if ((assignment.firstExaminers || []).some((value) => teacherIdOf(value) === id)) {
    return "First examiner";
  }
  if (teacherIdOf(assignment.secondExaminer) === id) return "Second examiner";
  if (teacherIdOf(assignment.thirdExaminer?.teacher) === id) return "Third examiner";
  return "Examiner";
}

function committeeRole(committee, teacherId) {
  const id = String(teacherId);
  for (const [slot, label] of COMMITTEE_SLOTS) {
    if (teacherIdOf(committee[slot]) === id) return label;
  }
  return "Member";
}

function courseOf(course) {
  if (!course) return null;
  return {
    id: String(course._id || course),
    course_code: course.course_code || null,
    course_name: course.course_name || null,
    course_type: course.course_type || null,
    course_credit: course.course_credit ?? null,
  };
}

function sessionOf(session) {
  if (!session) return { id: null, session: null, batch: null, current_semester: null };
  return {
    id: String(session._id || session),
    session: session.session || null,
    batch: session.batch || null,
    current_semester: session.current_semester ?? null,
  };
}

function maskStoredNid(teacher) {
  if (!teacher?.nid) return null;
  try {
    return maskNid(decrypt(teacher.nid));
  } catch {
    return null;
  }
}

async function shapeProfile(teacher) {
  const roles = await getRoles(teacher._id);
  return {
    id: String(teacher._id),
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone || null,
    photo: teacher.photo || null,
    status: teacher.status,
    nidMasked: maskStoredNid(teacher),
    roles,
    mustChangePassword: Boolean(teacher.mustChangePassword),
    createdAt: teacher.createdAt,
  };
}

// GET /api/me/profile — the signed-in teacher's own record.
async function getProfile(req, res, next) {
  try {
    const teacher = await Teacher.findById(req.user.sub).select(
      "+nid name email phone photo status mustChangePassword createdAt"
    );
    if (!teacher || teacher.status !== "active") {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }
    return res.json({ data: await shapeProfile(teacher) });
  } catch (err) {
    return next(err);
  }
}

// PATCH /api/me/profile — update editable details only.
// Email changes go through the verified request/confirm flow.
async function updateProfile(req, res, next) {
  try {
    const teacher = await Teacher.findById(req.user.sub).select("+nid status");
    if (!teacher || teacher.status !== "active") {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    const body = cleanObject(req.body);
    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    const updated = [];

    if (has("name")) {
      teacher.name = body.name;
      updated.push("name");
    }
    if (has("phone")) {
      teacher.phone = body.phone || null;
      updated.push("phone");
    }
    if (has("photo")) {
      teacher.photo = body.photo || null;
      updated.push("photo");
    }

    await teacher.save();
    await writeAudit({
      actor: new mongoose.Types.ObjectId(req.user.sub),
      actorType: "teacher",
      action: "profile.update",
      entity: "Teacher",
      entityId: teacher._id,
      meta: { updated },
    });

    return res.json({ data: await shapeProfile(teacher) });
  } catch (err) {
    return next(err);
  }
}

// GET /api/me/profile/courses — current course load derived from assignments
// in active sessions. A teacher has no direct batch/semester field, so the
// active-session assignments are the source of truth.
async function getCurrentCourses(req, res, next) {
  try {
    const tid = new mongoose.Types.ObjectId(req.user.sub);
    const sessions = await Session.find({ status: "active" })
      .select("session batch current_semester status")
      .lean();
    if (sessions.length === 0) {
      return res.json({ count: 0, totalCredits: 0, sessions: [] });
    }

    const sessionIds = sessions.map((session) => session._id);
    const assignments = await CourseAssignment.find({
      session: { $in: sessionIds },
      $or: [
        { firstExaminers: tid },
        { secondExaminer: tid },
        { "thirdExaminer.teacher": tid },
      ],
    })
      .populate("course", "course_code course_name course_type course_credit")
      .populate("session", "session batch current_semester status")
      .sort({ semester: 1, createdAt: 1 })
      .lean();

    const grouped = new Map();
    let count = 0;
    let totalCredits = 0;

    for (const assignment of assignments) {
      const session = sessionOf(assignment.session);
      const course = courseOf(assignment.course);
      if (!course) continue;

      const key = session.id || "unknown";
      if (!grouped.has(key)) {
        grouped.set(key, { ...session, courses: [], totalCredits: 0 });
      }
      const group = grouped.get(key);
      const credit = Number(course.course_credit) || 0;

      group.courses.push({
        ...course,
        semester: assignment.semester,
        role: examinerRole(assignment, tid),
        studentCount: assignment.thirdExaminer?.studentCount ?? null,
      });
      group.totalCredits += credit;
      totalCredits += credit;
      count += 1;
    }

    return res.json({
      count,
      totalCredits,
      sessions: [...grouped.values()],
    });
  } catch (err) {
    return next(err);
  }
}

// GET /api/me/profile/duties — examiner roles, committee memberships,
// invigilation, and other current responsibilities.
async function getCurrentDuties(req, res, next) {
  try {
    const tid = new mongoose.Types.ObjectId(req.user.sub);
    const now = new Date();
    const startOfToday = startOfDayInTZ(now);

    const sessions = await Session.find({ status: "active" }).select("_id").lean();
    const sessionIds = sessions.map((session) => session._id);

    const committeeMatch = {
      status: "active",
      start: { $lte: now },
      end: { $gte: startOfToday },
      $or: COMMITTEE_SLOTS.map(([slot]) => ({ [slot]: tid })),
    };

    const [committees, assignments, routines, chairmanship] = await Promise.all([
      ExamCommittee.find(committeeMatch)
        .populate("chairman member1 member2 tabulator1 tabulator2", "name")
        .populate("session", "session batch")
        .sort({ start: -1 })
        .lean(),
      sessionIds.length
        ? CourseAssignment.find({
            session: { $in: sessionIds },
            $or: [
              { firstExaminers: tid },
              { secondExaminer: tid },
              { "thirdExaminer.teacher": tid },
            ],
          })
            .populate("course", "course_code course_name course_type course_credit")
            .populate("session", "session batch")
            .sort({ semester: 1, createdAt: 1 })
            .lean()
        : [],
      sessionIds.length
        ? Routine.find({ session: { $in: sessionIds }, invigilators: tid })
            .populate("course", "course_code course_name")
            .populate("session", "session batch")
            .sort({ date: 1, time: 1 })
            .lean()
        : [],
      DepartmentChairman.findOne({ teacher: tid, status: "active" })
        .select("startDate")
        .lean(),
    ]);

    const examinerRoles = assignments.map((assignment) => ({
      id: String(assignment._id),
      role: examinerRole(assignment, tid),
      course: courseOf(assignment.course),
      session: sessionOf(assignment.session),
      semester: assignment.semester,
      studentCount: assignment.thirdExaminer?.studentCount ?? null,
    }));

    const committeeMemberships = committees.map((committee) => {
      const session = sessionOf(committee.session);
      return {
        id: String(committee._id),
        role: committeeRole(committee, tid),
        session: session.session,
        batch: session.batch,
        semester: committee.semester,
        start: committee.start,
        end: committee.end,
        members: COMMITTEE_SLOTS.map(([slot, label]) => {
          const person = committee[slot];
          if (!person) return null;
          return { id: teacherIdOf(person), name: person.name || "Unknown teacher", role: label };
        }).filter(Boolean),
      };
    });

    const invigilation = routines.map((routine) => ({
      id: String(routine._id),
      course: courseOf(routine.course),
      session: sessionOf(routine.session),
      semester: routine.semester,
      date: routine.date,
      time: routine.time || null,
    }));

    const otherResponsibilities = [];
    if (chairmanship) {
      otherResponsibilities.push({
        type: "chairman",
        label: "Department Chairman",
        since: chairmanship.startDate,
      });
    }

    return res.json({
      counts: {
        examiner: examinerRoles.length,
        committee: committeeMemberships.length,
        invigilation: invigilation.length,
        other: otherResponsibilities.length,
      },
      examinerRoles,
      committeeMemberships,
      invigilation,
      otherResponsibilities,
    });
  } catch (err) {
    return next(err);
  }
}

export { getProfile, updateProfile, getCurrentCourses, getCurrentDuties };
