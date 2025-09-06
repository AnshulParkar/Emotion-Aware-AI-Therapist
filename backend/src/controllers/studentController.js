import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashedPassword });
    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMood = async (req, res) => {
  const { status, frequency } = req.body;
    try {
        const student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        student.mood.status = status;
        student.mood.frequency = frequency;
        student.mood.lastRecorded = new Date();
        await student.save();
        res.json({ message: "Mood updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMood = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student.mood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student.moodHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

