import express from "express";
import { register, login } from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", (req, res) => {
  res.send("Student Routes Testing");
});

export default router;
