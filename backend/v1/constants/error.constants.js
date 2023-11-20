module.exports = {
    user: {
        duplicate: {
            code: "user-0001",
            message: "User Exists",
            userFacingMessage: "User already exists, please use a different ssn."
        }
    },
    params: {
        invalidDate: {
            code: "param-0001",
            message: "Invalid date",
            userFacingMessage: "The date provided is invalid"
        }
    },
    server: {
        internal: {
            code: "interal-0001",
            message: "Internal Server Error",
            userFacingMessage: "Internal error occurred, please try again later."
        }
    }
}