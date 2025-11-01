import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("WalletLock Backend API ✅"));
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
