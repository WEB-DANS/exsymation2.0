import { Router } from "express";

import {
  getProfile,
  updateProfile,
  getCurrentCourses,
  getCurrentDuties,
} from "../controllers/teacherProfile.controller.js";
import { protectTeacher, requirePasswordChanged } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../validators/teacherProfile.validator.js";

const router = Router();

// Signed-in teacher only. The profile itself stays readable during
// mustChangePassword so the teacher can reach the change-password button.
router.use(protectTeacher);

router.get("/", getProfile);

// Everything else unlocks after the first-login password change.
router.use(requirePasswordChanged);

router.patch("/", validate(updateProfileSchema), updateProfile);
router.get("/courses", getCurrentCourses);
router.get("/duties", getCurrentDuties);

export default router;
