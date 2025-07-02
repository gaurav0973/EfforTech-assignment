import express from "express";
import { createUser, deleteUser, getAllUsers, updateUser } from "../controllers/user.controller.js";

const userRoutes = express.Router();


userRoutes.get("/", getAllUsers);
userRoutes.post("/", createUser);
userRoutes.patch("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);


export default userRoutes;

