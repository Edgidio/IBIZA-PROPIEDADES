import Joi from 'joi';

const createUserSchema = Joi.object({
  usuario: Joi.string().min(3).max(20).required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'string.base': 'El usuario debe ser una cadena de texto',
    'string.min': 'El usuario debe tener al menos {#limit} caracteres',
    'string.max': 'El usuario no puede tener más de {#limit} caracteres',
    'any.required': 'Por favor, proporcione un usuario',
  }),

  password: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'string.base': 'La contraseña debe ser una cadena de texto',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
    'string.max': 'La contraseña no puede tener más de {#limit} caracteres',
    'any.required': 'Por favor, proporcione una contraseña',
  }),

  passwordr: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'any.only': 'Las contraseñas deben coincidir',
    'any.required': 'Debe repetir la contraseña',
  }),
});

export {createUserSchema}