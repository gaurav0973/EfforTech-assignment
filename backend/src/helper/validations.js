import validator  from "validator";
export const validateUser = (req) => {
    const { firstName, lastName, email, phone, pan } = req.body;
    if(!firstName || !lastName || !email || !phone || !pan) {
        return new ApiError("All fields are required", 400);
    }
    else if(!validator.isEmail(email)) {
        return new ApiError("Invalid email format", 400);
    }
    else if(!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
        return new ApiError("Invalid phone number format", 400);
    }
    else(!validator.isLength(pan, { min: 10, max: 10 })) {
        return new ApiError("Invalid PAN number format", 400);
    }
}