/* import Joi from 'joi';

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

export { contactoSchema }; */

import Joi from 'joi';

const contactoSchema = (messages) => Joi.object({
  correo: Joi.string().email().max(100).required().messages({
    'string.base': messages.correo.base,
    'string.email': messages.correo.email,
    'string.max': messages.correo.max,
    'any.required': messages.correo.required,
    'any.unknown': messages.correo.unknown,
    'string.empty': messages.correo.empty,
  }),
  nombre: Joi.string().max(50).required().messages({
    'string.base': messages.nombre.base,
    'string.empty': messages.nombre.empty,
    'string.max': messages.nombre.max,
    'any.required': messages.nombre.required,
  }),
  telefono: Joi.string().max(50).required().messages({
    'string.base': messages.telefono.base,
    'string.empty': messages.telefono.empty,
    'string.max': messages.telefono.max,
    'any.required': messages.telefono.required,
  }),
  asunto: Joi.string().max(50).required().messages({
    'string.base': messages.asunto.base,
    'string.empty': messages.asunto.empty,
    'string.max': messages.asunto.max,
    'any.required': messages.asunto.required,
  }),
  mensaje: Joi.string().max(500).required().messages({
    'string.base': messages.mensaje.base,
    'string.empty': messages.mensaje.empty,
    'string.max': messages.mensaje.max,
    'any.required': messages.mensaje.required,
  }),
});

export { contactoSchema };