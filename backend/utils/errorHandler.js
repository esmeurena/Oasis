// utils/errorHandler.js
class noResourceError extends Error {
    constructor(message,status){
        super(message)
        this.message = message,
        this.status = status || 500
    }
    throwThis(){
        throw this;
    }
    static throw(message,status){
        const newError = noResourceError(message,status)
        throw newError;
    }
}


class ErrorHandler extends Error {
    constructor(message, status, errors = null) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

const handleError = (err, req, res, next) => {
    const statusCode = err.statusCode || 404;
    const message = err.message || "Internal Server Error";
    
    const response = {
        message: message
    };

    if (err.errors) {
        response.errors = err.errors;
    }

    res.status(statusCode).json(response);
};

module.exports = { noResourceError, ErrorHandler, handleError };