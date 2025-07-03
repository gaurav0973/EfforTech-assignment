import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the User Management Web Application API");
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
