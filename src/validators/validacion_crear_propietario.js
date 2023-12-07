import Joi from 'joi';

const createPropietario = Joi.object({
  cedula: Joi.number().integer().positive().required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'number.base': 'La cédula debe ser un número',
    'number.integer': 'La cédula debe ser un número entero',
    'number.positive': 'La cédula debe ser un número positivo',
    'any.required': 'Por favor, proporcione la cédula',
    'number.unsafe': 'La cédula debe ser un número seguro',
  }),

  nombres: Joi.string().max(60).required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'string.base': 'Los nombres deben ser una cadena de texto',
    'string.max': 'Los nombres no pueden tener más de {#limit} caracteres',
    'any.required': 'Por favor, proporcione los nombres',
  }),

  apellidos: Joi.string().max(60).required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'string.base': 'Los apellidos deben ser una cadena de texto',
    'string.max': 'Los apellidos no pueden tener más de {#limit} caracteres',
    'any.required': 'Por favor, proporcione los apellidos',
  }),

  telefono: Joi.string().max(15).required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'string.base': 'El teléfono debe ser una cadena de texto',
    'string.max': 'El teléfono no puede tener más de {#limit} caracteres',
    'any.required': 'Por favor, proporcione el teléfono',
  }),

  correo: Joi.string().max(100).email().required().messages({
    'string.empty': 'No se permite que el campo esté vacío',
    'string.base': 'El correo debe ser una cadena de texto',
    'string.max': 'El correo no puede tener más de {#limit} caracteres',
    'string.email': 'Ingrese un correo electrónico válido',
    'any.required': 'Por favor, proporcione el correo',
  }),
});

export { createPropietario };