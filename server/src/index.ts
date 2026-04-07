import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tickets", ticketRoutes);

app.use((_, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
