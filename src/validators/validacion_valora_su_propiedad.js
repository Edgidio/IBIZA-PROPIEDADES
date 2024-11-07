import Joi from 'joi';

const valorarPropiedadesSchema = (messages) => Joi.object({
  ubicacion: Joi.string().max(100).min(5).required().messages({
    'string.min': messages.ubicacion.min,
    'string.empty': messages.ubicacion.empty,
    'string.max': messages.ubicacion.max,
    'any.required': messages.ubicacion.required,
  }),

  numeroCasa: Joi.number().integer().positive().allow(null, '').messages({
    'number.base': messages.numeroCasa.base,
    'number.positive': messages.numeroCasa.positive,
  }),

  tipoPropiedad: Joi.string().valid('casa', 'apartamento').required().messages({
    'any.only': messages.tipoPropiedad.only,
    'any.required': messages.tipoPropiedad.required,
  }),

  plantaApartamento: Joi.string().max(10).allow('').messages({
    'string.max': messages.plantaApartamento.max,
  }),

  puertaBloque: Joi.string().max(10).allow('').messages({
    'string.max': messages.puertaBloque.max,
  }),

  superficieConstruidaApartamento: Joi.number().positive().allow(null, '').messages({
    'number.base': messages.superficieConstruidaApartamento.base,
    'number.positive': messages.superficieConstruidaApartamento.positive,
  }),

  superficieConstruida: Joi.number().positive().allow(null, '').messages({
    'number.base': messages.superficieConstruida.base,
    'number.positive': messages.superficieConstruida.positive,
  }),

  areaTerreno: Joi.number().positive().allow(null, '').messages({
    'number.base': messages.areaTerreno.base,
    'number.positive': messages.areaTerreno.positive,
  }),

  numHabitaciones: Joi.number().integer().min(0).messages({
    'number.base': messages.numHabitaciones.base,
    'number.min': messages.numHabitaciones.min,
  }),

  numBanios: Joi.number().integer().min(0).messages({
    'number.base': messages.numBanios.base,
    'number.min': messages.numBanios.min,
  }),

  EstadoPropiedad: Joi.string().max(100).required().messages({
    'string.empty': messages.EstadoPropiedad.empty,
    'string.max': messages.EstadoPropiedad.max,
    'any.required': messages.EstadoPropiedad.required,
  }),

  caracteristica: Joi.array().items(Joi.string().valid('Piscina', 'Terraza', 'Garaje')).messages({
    'array.base': messages.caracteristica.base,
    'any.only': messages.caracteristica.only,
  }),

  nombre: Joi.string().max(50).required().messages({
    'string.empty': messages.nombre.empty,
    'string.max': messages.nombre.max,
    'any.required': messages.nombre.required,
  }),

  Apellidos: Joi.string().max(50).required().messages({
    'string.empty': messages.Apellidos.empty,
    'string.max': messages.Apellidos.max,
    'any.required': messages.Apellidos.required,
  }),

  correo: Joi.string().email().required().messages({
    'string.email': messages.correo.email,
    'string.empty': messages.correo.empty,
    'any.required': messages.correo.required,
  }),

  telefono: Joi.string().pattern(/^[0-9]{7,15}$/).required().messages({
    'string.pattern.base': messages.telefono.pattern,
    'string.empty': messages.telefono.empty,
    'any.required': messages.telefono.required,
  }),

  contactar: Joi.array().items(Joi.string().valid('Mañana', 'Tarde', 'Noche')).required().messages({
    'array.base': messages.contactar.base,
    'any.only': messages.contactar.only,
    'any.required': messages.contactar.required,
    'array.sparse': messages.contactar.sparse,
  }),
});

export { valorarPropiedadesSchema };
