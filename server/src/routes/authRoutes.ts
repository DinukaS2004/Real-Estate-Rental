import { Router } from "express";
import { syncUser } from "../controllers/authController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.post("/me", verifyToken, syncUser);

export default router;