import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes (need to add one by one below) ──────────────
// app.use("/api/v1/properties", propertyRoutes);
// app.use("/api/v1/applications", applicationRoutes);
// app.use("/api/v1/leases", leaseRoutes);
// app.use("/api/v1/tenants", tenantRoutes);
// app.use("/api/v1/managers", managerRoutes);

// ── Error handler (must be last) ───────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;