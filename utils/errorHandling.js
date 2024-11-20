// utils/errorHandler.js

// Used in routes.js

export const handleErrorResponse = (res, statusCode, message, error = null) => {

    if (error) {
        console.error(message, error);
    }

    res.status(statusCode).json({ 
        message, 
        error: error ? error.message : undefined });
};

// Used in auth.js

export const sendSignupErrorResponse = (res, code, message, addAuthHeaders = true) => {

    const response = res.status(code);

    if (addAuthHeaders) {

        response.append('WWW-Authenticate', 'Bearer');
        response.append('Location', 'http://localhost:3333/signup.html');
    }

    return response.json({ error: message });
};

export const sendLoginErrorResponse = (res, code, message, addAuthHeaders = false) => {

    const response = res.status(code);

    if (addAuthHeaders) {

        response.append('WWW-Authenticate', 'Bearer');
        response.append('Location', 'http://localhost:3333/login.html');
    }

    return response.json({ error: message });
};