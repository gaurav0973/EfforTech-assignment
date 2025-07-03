import express from "express";
import { bulkUploadUsers } from "../controllers/upload.controller.js";
import upload from "../middleware/upload.js";

const uploadRoutes = express.Router();


uploadRoutes.post("/bulk-upload", upload.single("excelFile"), bulkUploadUsers);

export default uploadRoutes;
