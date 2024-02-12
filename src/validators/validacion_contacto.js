import Joi from 'joi';

const contactoSchema = Joi.object({
  correo: Joi.string().email().max(100).required().messages({
    'string.base': 'El correo electrónico debe ser una cadena de texto.',
    'string.email': 'Ingrese un correo electrónico válido.',
    'string.max': 'El correo electrónico no puede tener más de {#limit} caracteres.',
    'any.required': 'El correo electrónico es un campo requerido.',
    'any.unknown': 'El campo "{#label}" no está permitido o no es válido.', 
    'string.empty': 'El correo electrónico no puede estar vacío.',
  }),

  nombre: Joi.string().max(50).required().messages({
    'string.base': 'El nombre debe ser una cadena de texto.',
    'string.empty': 'El nombre no puede estar vacío.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo requerido.',
  }),

  telefono: Joi.string().max(50).required().messages({
    'string.base': 'El telefono debe ser un numero valido.',
    'string.empty': 'El telefono no puede estar vacío.',
    'string.max': 'El telefono no puede tener más de {#limit} caracteres.',
    'any.required': 'El telefono es un campo requerido.',
  }),

  asunto: Joi.string().max(50).required().messages({
    'string.base': 'El asunto debe ser una cadena de texto.',
    'string.empty': 'El asunto no puede estar vacío.',
    'string.max': 'El asunto no puede tener más de {#limit} caracteres.',
    'any.required': 'El asunto es un campo requerido.',
  }),

  mensaje: Joi.string().max(500).required().messages({
    'string.base': 'El mensaje debe ser una cadena de texto.',
    'string.empty': 'El mensaje no puede estar vacío.',
    'string.max': 'El mensaje no puede tener más de {#limit} caracteres.',
    'any.required': 'El mensaje es un campo requerido.',
  }),
});

export { contactoSchema };