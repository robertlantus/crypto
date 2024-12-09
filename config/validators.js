// /config/validators.js

import Joi from 'joi';

export const registerSchema = Joi.object({

    username: Joi.string()
                 .min(3)
                 .max(30)
                 .required()
                 .messages({
                    'string.base': 'Username must be a string',
                    'string.empty': 'Username is not allowed to be empty',
                    'string.min': 'Username must be at least 3 characters long',
                    'string.max': 'Username cannot exceed 30 characters',
                    'any.required': 'Username field is required'
                }),
    email: Joi.string()
              .email()
              .required()
              .messages({
                'string.email': 'A valid email is required',
                'string.empty': 'Email is not allowed to be empty',
                'any.required': 'Email field is required'
            }),
    password: Joi.string()
                 .min(6)
                 .required()
                 .messages({
                    'string.empty': 'Password is not allowed to be empty',
                    'string.min': 'Password length must be at least 6 characters long',
                    'any.required': 'Password field is required'
                })
});

export const loginSchema = Joi.object({
    
    username: Joi.string()
                 .required()
                 .messages({
                    'string.base': 'Username must be a string', 
                    'string.empty': 'Username is not allowed to be empty',     // Custom message for empty string
                    'any.required': 'Username field is required'                  // Custom message for missing field
                }),
    password: Joi.string()
                 .required()
                 .messages({
                    'string.base': 'Password must be a string',
                    'string.empty': 'Password is not allowed to be empty',
                    'any.required': 'Password field is required'
                })
});

