import { z } from "zod";
export const createTeacherSchema = z.object({
  name: z.string().trim().min(2).max(120),
  employeeId: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(254),
  designation: z.string().trim().min(2).max(100)
});
