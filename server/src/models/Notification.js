import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  audience: { type: String, enum: ["ALL_TEACHERS", "COMMITTEE"], required: true },
  committee: { type: mongoose.Schema.Types.ObjectId, ref: "ExamCommittee" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipients: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, readAt: Date }]
}, { timestamps: true });
export default mongoose.model("Notification", notificationSchema);
