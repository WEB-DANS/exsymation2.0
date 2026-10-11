import Teacher from "../models/Teacher.js";
import AppError from "../utils/AppError.js";
export async function createTeacher(data) {
  const email = data.email.toLowerCase();
  const existing = await Teacher.findOne({ $or: [{ employeeId: data.employeeId }, { email }] });
  if (existing) throw new AppError("Teacher already exists", 409);
  return Teacher.create({ ...data, email });
}
export async function listTeachers({ page = 1, limit = 20, search = "" } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const filter = search ? { $or: [
    { name: { $regex: escapeRegex(search), $options: "i" } },
    { employeeId: { $regex: escapeRegex(search), $options: "i" } },
    { email: { $regex: escapeRegex(search), $options: "i" } }
  ] } : {};
  const [items, total] = await Promise.all([
    Teacher.find(filter).sort({ name: 1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    Teacher.countDocuments(filter)
  ]);
  return { items, page: safePage, limit: safeLimit, total };
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
