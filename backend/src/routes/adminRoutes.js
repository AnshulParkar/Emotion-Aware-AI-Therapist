import express from "express";
import { login, getStudentMoods, getAllStudents, getAdminProfile, updateProfile } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
//router.get("/students", protectAdmin, getStudentMoods); // temporarily removed protectAdmin middleware for testing

router.get("/students", getStudentMoods);
router.get("/all-students", getAllStudents);
router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateProfile);


export default router;
