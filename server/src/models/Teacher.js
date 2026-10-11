import mongoose from "mongoose";
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  employeeId: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  designation: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model("Teacher", teacherSchema);
