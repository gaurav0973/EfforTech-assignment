import validator from "validator";
import ApiError from "./apiError.js";

export const validateUser = (req) => {
    const { firstName, lastName, email, phone, pan } = req.body;
    if(!firstName || !lastName || !email || !phone || !pan) {
        throw new ApiError("All fields are required", 400);
    }
    else if(!validator.isEmail(email)) {
        throw new ApiError("Invalid email format", 400);
    }
    else if(!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
        throw new ApiError("Invalid phone number format", 400);
    }
    else if(!validator.isLength(pan, { min: 10, max: 10 })) {
        throw new ApiError("PAN number must be 10 characters long", 400);
    }
}