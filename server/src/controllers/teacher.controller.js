import * as teacherService from "../services/teacher.service.js";
export async function createTeacher(req, res) {
  const teacher = await teacherService.createTeacher(req.body);
  res.status(201).json({ success: true, message: "Teacher created successfully", data: teacher });
}
export async function listTeachers(req, res) {
  const result = await teacherService.listTeachers(req.query);
  res.json({ success: true, data: result.items, pagination: { page: result.page, limit: result.limit, total: result.total } });
}
