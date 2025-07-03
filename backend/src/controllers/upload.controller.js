import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import ApiError from "../helper/apiError.js";
import ApiResponse from "../helper/apiResponse.js";
import db from "../libs/db.js";

/**
 * Process Excel file and bulk upload users
 * Simple implementation without complex validation
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const bulkUploadUsers = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json(new ApiError("No file uploaded", 400));
    }

    const filePath = req.file.path;

    // Simple check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json(new ApiError("File not found", 400));
    }

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rows = xlsx.utils.sheet_to_json(worksheet);

    // Delete the file after reading
    fs.unlinkSync(filePath);

    // Basic check for empty file
    if (!rows || rows.length === 0) {
      return res.status(400).json(new ApiError("File contains no data", 400));
    }

    // Process and prepare user data
    const users = rows.map((row) => ({
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email || "",
      phone: String(row.phone || "").replace(/\D/g, ""), // Remove non-numeric characters
      pan: String(row.pan || "").toUpperCase(), // Convert to uppercase
    }));

    // Create users in database
    const createdUsers = await db.$transaction(
      users.map((user) => db.user.create({ data: user }))
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { count: createdUsers.length },
          `Successfully created ${createdUsers.length} users`
        )
      );
  } catch (error) {
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error in bulk upload:", error);

    // Simple error handling
    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to process file upload";

    return res.status(statusCode).json(new ApiError(message, statusCode));
  }
};
