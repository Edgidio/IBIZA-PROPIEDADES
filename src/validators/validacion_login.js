import Joi from 'joi';

// Definir el esquema de validación para el formulario de inicio de sesión
const loginSchema = Joi.object({
  usuario: Joi.string().label('usuario').required().min(3).max(30).messages({
    'string.base': 'Usuario incorrecto',
    'string.empty': 'Por favor, ingresa su usuario',
    'string.min': 'Usuario incorrecto',
    'string.max': 'Usuario incorrecto',
    'any.required': 'Usuario es un campo requerido',
  }),
  password: Joi.string().label('password').required().min(6).messages({
    'string.base': 'Contraseña incorrecta',
    'string.empty': 'Por favor, ingresa su contraseña',
    'string.min': 'Contraseña incorrecta',
    'any.required': 'La contraseña es un campo requerido.',
  }),
});

export { loginSchema };