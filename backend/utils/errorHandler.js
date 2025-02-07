// utils/errorHandler.js
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const handleError = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        message: message,
        status: statusCode
    });
};

module.exports = { ErrorHandler, handleError };