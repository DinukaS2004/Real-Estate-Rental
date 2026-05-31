import { Router, Request, Response, NextFunction } from "express";
import { generatePresignedUrl } from "../services/r2.service";
import { verifyToken } from "../middleware/auth";

const router = Router();

// POST /api/v1/uploads/presigned-url
router.post(
    "/presigned-url",
    verifyToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fileType } = req.body;

            if (!fileType) {
                return res.status(400).json({ error: "fileType is required" });
            }

            const { uploadUrl, publicUrl } = await generatePresignedUrl(fileType);

            res.json({ uploadUrl, publicUrl });
        } catch (err: any) {
            if (err.message?.includes("Only")) {
                return res.status(400).json({ error: err.message });
            }
            next(err);
        }
    }
);

export default router;