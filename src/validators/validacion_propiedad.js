import Joi from 'joi';

const correos_propiedadSchema = Joi.object({

  email: Joi.string().email().max(100).required().messages({
    'string.base': 'El correo debe ser una cadena de texto.',
    'string.email': 'Debe ser un correo electrónico válido.',
    'string.empty': 'El correo no puede estar vacío.',
    'string.max': 'El correo no puede tener más de {#limit} caracteres.',
    'any.required': 'El correo es un campo requerido.',
  }),

  name: Joi.string().max(50).required().messages({
    'string.base': 'El nombre debe ser una cadena de texto.',
    'string.empty': 'El nombre no puede estar vacío.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo requerido.',
  }),

  phone: Joi.string().max(50).required().messages({
    'string.base': 'El teléfono debe ser una cadena de texto.',
    'string.empty': 'El teléfono no puede estar vacío.',
    'string.max': 'El teléfono no puede tener más de {#limit} caracteres.',
    'any.required': 'El teléfono es un campo requerido.',
  }),

});

export { correos_propiedadSchema };