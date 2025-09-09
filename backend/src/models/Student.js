import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  mood: {
    status: { type: String, enum: ["happy", "neutral", "sad"], default: "neutral" },
    lastRecorded: { type: Date, default: null },
    frequency: { type: String, enum: ["never", "rarely", "occasionally", "frequently"], default: "never" }
  }
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
