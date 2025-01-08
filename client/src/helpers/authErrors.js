// Function to translate server error codes into user-friendly messages

// export const mapErrorToMessage = (error) => {
//     if (error.response) {
//         switch (error.response.status) {
//             case 400: 
//                 return 'Invalid request. Please check your input.';
//             case 401:
//                 return 'Invalid username or password. Please check your credentials.';
//             case 403:
//                 return 'Access denied. You may not have the required permissions.';
//             case 409:
//                 return 'This username is already registered. Please try another username.';
//             case 500:
//                 return 'Server error. Please try again later.';
//             default: 
//                 return 'An unexpected error occurred. Please try again.';
//         }
//     } else if (error.request) {
//         return 'No response from the server. Please check your network connection.';
//     } else {
//         return `Unexpected error: ${error.message}`;
//     }
// };


