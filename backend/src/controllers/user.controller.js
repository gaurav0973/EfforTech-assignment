import ApiError from "../helper/apiError.js"
import { validateUser } from "../helper/validations.js";
import { db } from "../libs/db.js"


export const getAllUsers = async (req, res) => {
    try {
        const users = await db.user.findMany({orderBy: { createdAt: "desc" }});
        return new ApiResponse(200, users, "Users fetched successfully");
    } catch (error) {
        return new ApiError("Unable to get all users", 500);
    }
}

export const createUser = async (req, res) => {
    try {
        // get the user data
        const { firstName, lastName, email, phone, pan } = req.body;
        
        // validate the user
        validateUser(req)

        // create the user
        const user = await db.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                pan
            }
        });

        // return the user
        return new ApiResponse(201, user, "User created successfully");
        
    } catch (error) {
        return new ApiError("Unable to create User", 500);
        
    }
}

export const updateUser = async (req, res) => {
    try {

        // get the user id
        const { id } = req.params;

        // get the user data
        const { firstName, lastName, email, phone, pan } = req.body;

        // validate the user
        validateUser(req);

        // update the user
        const user = await db.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                pan
            }
        });

        // return the user
        return new ApiResponse(200, user, "User updated successfully");
        
    } catch (error) {
        return new ApiError(`Unable to update User : ${error.message}`, 500);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // delete the user
        await db.user.delete({
            where: { id }
        });

        // return response
        return new ApiResponse(200, null, "User deleted successfully");
    } catch (error) {
        return new ApiError(`Unable to delete User : ${error.message}`, 500);
    }
}