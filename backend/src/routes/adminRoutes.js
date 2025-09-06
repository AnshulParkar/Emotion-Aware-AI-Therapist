import express from "express";
import { login, getStudentMoods } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
//router.get("/students", protectAdmin, getStudentMoods); // temporarily removed protectAdmin middleware for testing

router.get("/students", getStudentMoods);


export default router;
