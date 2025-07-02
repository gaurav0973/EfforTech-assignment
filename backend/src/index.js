import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


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



app.listen(process.env.PORT, () => {
  console.log("Server is running on port", port);
});