import mongoose from "mongoose";
const examCommitteeSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  chairman: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    role: { type: String, enum: ["FIRST_EXAMINER", "SECOND_EXAMINER", "THIRD_EXAMINER", "SCRUTINIZER", "TABULATOR", "MODERATOR", "INVIGILATOR", "MEMBER"], required: true }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model("ExamCommittee", examCommitteeSchema);
