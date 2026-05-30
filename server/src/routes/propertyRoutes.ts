import { Router } from "express";
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
} from "../controllers/propertyController";
import { verifyToken, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", getProperties);                                           // public
router.get("/:id", getPropertyById);                                     // public
router.post("/", verifyToken, requireRole("MANAGER"), createProperty);   // manager only
router.put("/:id", verifyToken, requireRole("MANAGER"), updateProperty); // manager only
router.delete("/:id", verifyToken, requireRole("MANAGER"), deleteProperty); // manager only

export default router;