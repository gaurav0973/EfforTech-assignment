class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.details = details;
  }
}

export default ApiError;
