import { Router } from "express";
import {
    submitApplication,
    getApplications,
    updateApplicationStatus,
    withdrawApplication,
} from "../controllers/applicationController";
import { verifyToken, requireRole } from "../middleware/auth";

const router = Router();

router.post("/", verifyToken, requireRole("TENANT"), submitApplication);
router.get("/", verifyToken, getApplications);
router.put("/:id/status", verifyToken, requireRole("MANAGER"), updateApplicationStatus);
router.delete("/:id", verifyToken, requireRole("TENANT"), withdrawApplication);

export default router;