import ApiError from "../helper/apiError.js";
import ApiResponse from "../helper/apiResponse.js";
import { validateUser } from "../helper/validations.js";
import db from "../libs/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError("Unable to get all users", 500));
  }
};

export const createUser = async (req, res) => {
  try {
    // get the user data
    const { firstName, lastName, email, phone, pan } = req.body;

    console.log("Creating user with data:", {
      firstName,
      lastName,
      email,
      phone,
      pan,
    });
    // validate the user
    validateUser(req);

    console.log("User data validated successfully");

    // create the user
    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        pan,
      },
    });
    console.log("User created successfully:", newUser);
    // return the user
    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "User created successfully"));
  } catch (error) {
    // Log detailed error information
    console.error("Error creating user:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json(new ApiError(error.message || "Unable to create User", statusCode));
  }
};

export const updateUser = async (req, res) => {
  try {
    // get the user id
    const { id } = req.params;

    // Convert string id to number for Prisma
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json(new ApiError("Invalid user ID", 400));
    }

    // get the user data
    const { firstName, lastName, email, phone, pan } = req.body;

    // validate the user
    validateUser(req);

    // update the user
    const user = await db.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        phone,
        pan,
      },
    });

    // return the user
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json(new ApiError(error.message || `Unable to update User`, statusCode));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Convert string id to number for Prisma
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return res.status(400).json(new ApiError("Invalid user ID", 400));
    }

    // delete the user
    await db.user.delete({
      where: { id: userId },
    });

    // return response
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json(new ApiError(error.message || "Unable to delete User", statusCode));
  }
};
