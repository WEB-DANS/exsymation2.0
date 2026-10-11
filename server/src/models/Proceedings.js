import mongoose from "mongoose";
const entrySchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  role: { type: String, required: true },
  description: { type: String, default: "" },
  quantity: { type: Number, min: 1, default: 1 },
  rate: { type: Number, min: 0, required: true },
  amount: { type: Number, min: 0, required: true }
}, { _id: true });
const proceedingsSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  entries: [entrySchema],
  status: { type: String, enum: ["DRAFT", "GENERATED", "APPROVED", "REJECTED"], default: "DRAFT" },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: Date
}, { timestamps: true });
export default mongoose.model("Proceedings", proceedingsSchema);
