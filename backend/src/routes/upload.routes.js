import express from "express";
import { bulkUploadUsers } from "../controllers/upload.controller.js";
import upload from "../middleware/upload.js";

const uploadRoutes = express.Router();

// Route for bulk uploading users from Excel file
uploadRoutes.post("/bulk-upload", upload.single("excelFile"), bulkUploadUsers);

export default uploadRoutes;
