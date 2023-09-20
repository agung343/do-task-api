const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong"
    const validateErrorMsg = err.validateErrorMsg
    res.status(statusCode).json({
        message: message,
        validateErrorMsg: validateErrorMsg
    })
    next()
}

export default errorHandler;