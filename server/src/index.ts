import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});