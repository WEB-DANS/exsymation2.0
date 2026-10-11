import mongoose from "mongoose";
const examRoutineSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  courseCode: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  room: { type: String, required: true },
  assignedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT" }
}, { timestamps: true });
export default mongoose.model("ExamRoutine", examRoutineSchema);
