import Joi from 'joi';

const add_propiedadSchema = Joi.object({
  descripcion: Joi.string().max(100).required().messages({
    'string.base': 'La descripción debe ser una cadena de texto.',
    'string.empty': 'La descripción no puede estar vacía.',
    'string.max': 'La descripción no puede tener más de {#limit} caracteres.',
    'any.required': 'La descripción es un campo requerido.',
  }),

  detalles: Joi.string().max(2000).required().messages({
    'string.base': 'Los detalles deben ser una cadena de texto.',
    'string.empty': 'Los detalles no pueden estar vacíos.',
    'string.max': 'Los detalles no pueden tener más de {#limit} caracteres.',
    'any.required': 'Los detalles son un campo requerido.',
  }),

  estado: Joi.string().max(100).default('pendiente').messages({
    'string.base': 'El estado debe ser una cadena de texto.',
    'string.max': 'El estado no puede tener más de {#limit} caracteres.',
  }),

  ubicacion: Joi.string().max(100).messages({
    'string.base': 'La ubicación debe ser una cadena de texto.',
    'string.max': 'La ubicación no puede tener más de {#limit} caracteres.',
    'string.empty': 'La ubicación no puede estar vacía.',
  }),

  precio: Joi.number().default(0).messages({
    'number.base': 'El precio debe ser un número.',
  }),

  estacionamiento: Joi.number().default(0).messages({
    'number.base': 'El estacionamiento debe ser un número.',
  }),

  maletero: Joi.number().default(0).messages({
    'number.base': 'El maletero debe ser un número.',
  }),

  venta_renta: Joi.string().max(1).default('V').messages({
    'string.base': 'La opción de venta/renta debe ser una cadena de texto.',
    'string.max': 'La opción de venta/renta no puede tener más de {#limit} caracteres.',
  }),

  n_habitaciones: Joi.number().default(0).messages({
    'number.base': 'El número de habitaciones debe ser un número.',
  }),

  n_banos: Joi.number().default(0).messages({
    'number.base': 'El número de baños debe ser un número.',
  }),

  superficie: Joi.number().default(0).messages({
    'number.base': 'La superficie debe ser un número.',
  }),

  terreno: Joi.number().default(0).messages({
    'number.base': 'El terreno debe ser un número.',
  }),

  id: Joi.number().default(0).messages({
    'number.base': 'El terreno debe ser un número.',
  }),

  tipo_propiedad: Joi.string().max(1).messages({
    'string.base': 'El tipo de propiedad debe ser una cadena de texto.',
    'string.max': 'El tipo de propiedad no puede tener más de {#limit} caracteres.',
  }),

  fotos: Joi.any().optional().meta({ type: 'file' })

});

export { add_propiedadSchema};