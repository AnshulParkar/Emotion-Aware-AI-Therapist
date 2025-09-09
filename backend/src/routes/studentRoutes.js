import express from "express";
import { register, login, getMood, getMoodHistory, getStudentProfile, updateProfile, updateMood, deleteStudent } from "../controllers/studentController.js";
import { protectStudent } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/mood", getMood);
router.get("/mood-history", getMoodHistory);
router.get("/profile", getStudentProfile);
router.put("/profile", updateProfile);
router.put("/mood", updateMood);
router.delete("/:id", protectStudent, deleteStudent);

router.get("/", (req, res) => {
  res.send("Student Routes Testing");
});

export default router;
