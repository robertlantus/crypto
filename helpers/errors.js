
// /helpers/errors.js

const sendErrorResponse = (res, statusCode, message, links) => {
    return res.status(statusCode).json({
        message,
        links
    });
};

export default sendErrorResponse;