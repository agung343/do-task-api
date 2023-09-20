class CustomError extends Error {
    constructor(message, statusCode, validateErrorMsg) {
        super(message)
        this.statusCode = statusCode
        this.validateErrorMsg = validateErrorMsg
    }
}

export default CustomError;