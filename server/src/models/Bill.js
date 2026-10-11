import mongoose from "mongoose";
const billSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  proceedings: { type: mongoose.Schema.Types.ObjectId, ref: "Proceedings", required: true },
  lineItems: [{ description: String, quantity: { type: Number, min: 1 }, rate: { type: Number, min: 0 }, amount: { type: Number, min: 0 } }],
  totalAmount: { type: Number, min: 0, required: true },
  status: { type: String, enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "PAID"], default: "DRAFT" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paidAt: Date
}, { timestamps: true });
export default mongoose.model("Bill", billSchema);
