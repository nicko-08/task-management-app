import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes";

process.on("exit", (code) => {
  console.log(`About to exit with code: ${code}`);
});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
