import axios from "axios";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

function UserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPAN] = useState("");
  const [errors, setErrors] = useState({});
  const [showPAN, setShowPAN] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in edit mode with user data
  useEffect(() => {
    const userToEdit = location.state?.user;
    if (userToEdit) {
      setFirstName(userToEdit.firstName);
      setLastName(userToEdit.lastName);
      setEmail(userToEdit.email);
      setPhone(userToEdit.phone);
      setPAN(userToEdit.pan);
      setUserId(userToEdit.id);
      setEditMode(true);
    }
  }, [location]);

  // Validation functions
  const validateEmail = (email) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const validatePAN = (pan) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // PAN validation
    if (!pan.trim()) {
      newErrors.pan = "PAN number is required";
    } else if (!validatePAN(pan)) {
      newErrors.pan = "PAN must be in format: ABCDE1234F";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        pan,
      };

      let res;

      if (editMode) {
        // Update existing user
        res = await axios.patch(
          `http://localhost:5000/api/users/${userId}`,
          userData
        );
        toast.success("User updated successfully!");
      } else {
        // Create new user
        res = await axios.post("http://localhost:5000/api/users", userData);
        toast.success("User created successfully!");
      }

      console.log("Form submitted successfully:", res.data.data);

      if (editMode) {
        // Navigate back to user list
        navigate("/users");
      } else {
        // Clear form for new entry
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPAN("");
        setErrors({});
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        editMode
          ? "An error occurred while updating the user"
          : "An error occurred while creating the user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {editMode ? "Edit User" : "Add New User"}
      </h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number (10 digits) *
          </label>
          <input
            type="text"
            name="phone"
            value={phone}
            placeholder="1234567890"
            maxLength={10}
            onChange={(e) => {
              // Only allow numeric input
              const value = e.target.value.replace(/\D/g, "");
              setPhone(value);
            }}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            PAN Number *
          </label>
          <div className="relative">
            <input
              type={showPAN ? "text" : "password"}
              name="pan"
              value={pan}
              onChange={(e) => setPAN(e.target.value.toUpperCase())}
              maxLength={10}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.pan ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10`}
              placeholder="ABCDE1234F"
            />
            <button
              type="button"
              onClick={() => setShowPAN((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 mt-1"
            >
              {showPAN ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.pan && (
            <p className="mt-1 text-sm text-red-600">{errors.pan}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          {editMode && (
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : editMode
                ? "Update User"
                : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
