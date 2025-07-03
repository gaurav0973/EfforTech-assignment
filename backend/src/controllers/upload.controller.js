import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import ApiError from "../helper/apiError.js";
import ApiResponse from "../helper/apiResponse.js";
import db from "../libs/db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const bulkUploadUsers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiError("No file uploaded", 400));
    }

    const filePath = req.file.path;

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

    const users = rows.map((row) => ({
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      email: row.email || "",
      phone: String(row.phone || ""),
      pan: String(row.pan || "").toUpperCase(),
    }));

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
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error in bulk upload:", error);

    const statusCode = error.statusCode || 500;
    const message = error.message || "Failed to process file upload";

    return res.status(statusCode).json(new ApiError(message, statusCode));
  }
};

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const downloadTemplate = (req, res) => {
  try {
    // Create a workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheetData = [
      ["firstName", "lastName", "email", "phone", "pan"],
      ["John", "Doe", "john.doe@gmail.com", "9876543210", "ABCDE1234F"],
      ["Jane", "Smith", "jane.smith@gmail.com", "8765432109", "PQRST5678G"],
      [
        "Alex",
        "Johnson",
        "alex.johnson@gmail.com",
        "7654321098",
        "LMNOP9012H",
      ],
    ];

    // Convert data to worksheet
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

    // Create a temporary file
    const tempFilePath = path.join(
      __dirname,
      "../../uploads/user_template.xlsx"
    );

    // Ensure the uploads directory exists
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Write the workbook to the file
    xlsx.writeFile(workbook, tempFilePath);

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="user_template.xlsx"'
    );

    // Send the file
    res.download(tempFilePath, "user_template.xlsx", (err) => {
      // Delete the temporary file after sending
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      if (err) {
        console.error("Error sending template file:", err);
      }
    });
  } catch (error) {
    console.error("Error generating template:", error);
    res.status(500).json(new ApiError("Failed to generate template file", 500));
  }
};
