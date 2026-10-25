import { z } from "zod";

// Email is intentionally excluded: it has its own verified change flow
// (POST /api/me/email/request + /api/me/email/confirm).
const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    phone: z.string().trim().max(20).nullable().optional(),
    photo: z.string().trim().max(1024).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export { updateProfileSchema };
