import mongoose from "mongoose";
const examSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  examType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["DRAFT", "COMMITTEE_ASSIGNED", "SCHEDULED", "ONGOING", "COMPLETED", "CLOSED"], default: "DRAFT" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export default mongoose.model("Exam", examSchema);
