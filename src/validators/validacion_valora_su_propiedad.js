import Joi from 'joi';

// Definición del esquema de validación
const valorarPropiedadesSchema = () => Joi.object({
  ubicacion: Joi.string().max(100).min(5).required().messages({
    'string.min': 'La ubicación tiene que tener más de 5 caracteres.',
    'string.empty': 'La ubicación no puede estar vacía.',
    'string.max': 'La ubicación no puede tener más de {#limit} caracteres.',
    'any.required': 'La ubicación es un campo requerido.',
  }),

  numeroCasa: Joi.number().integer().positive().allow(null, '').messages({
    'number.base': 'El número de casa debe ser un número.',
    'number.positive': 'El número de casa debe ser positivo.',
  }),

  tipoPropiedad: Joi.string().valid('casa', 'apartamento').required().messages({
    'any.only': 'El tipo de propiedad debe ser "casa" o "apartamento".',
    'any.required': 'El tipo de propiedad es un campo requerido.',
  }),

  plantaApartamento: Joi.string().max(10).allow('').messages({
    'string.max': 'La planta del apartamento no puede tener más de {#limit} caracteres.',
  }),

  puertaBloque: Joi.string().max(10).allow('').messages({
    'string.max': 'La puerta o bloque no puede tener más de {#limit} caracteres.',
  }),

  superficieConstruidaApartamento: Joi.number().positive().allow(null, '').messages({
    'number.base': 'La superficie construida del apartamento debe ser un número.',
    'number.positive': 'La superficie construida del apartamento debe ser positiva.',
  }),

  superficieConstruida: Joi.number().positive().allow(null, '').messages({
    'number.base': 'La superficie construida debe ser un número.',
    'number.positive': 'La superficie construida debe ser positiva.',
  }),

  areaTerreno: Joi.number().positive().allow(null, '').messages({
    'number.base': 'El área del terreno debe ser un número.',
    'number.positive': 'El área del terreno debe ser positiva.',
  }),

  numHabitaciones: Joi.number().integer().min(0).messages({
    'number.base': 'El número de habitaciones debe ser un número entero.',
    'number.min': 'El número de habitaciones no puede ser negativo.',
  }),

  numBanios: Joi.number().integer().min(0).messages({
    'number.base': 'El número de baños debe ser un número entero.',
    'number.min': 'El número de baños no puede ser negativo.',
  }),

  EstadoPropiedad: Joi.string().max(100).required().messages({
    'string.empty': 'El estado de la propiedad no puede estar vacío.',
    'string.max': 'El estado de la propiedad no puede tener más de {#limit} caracteres.',
    'any.required': 'El estado de la propiedad es un campo requerido.',
  }),

  caracteristica: Joi.array().items(Joi.string().valid('Piscina', 'Terraza', 'Garaje')).messages({
    'array.base': 'Las características deben ser un arreglo.',
    'any.only': 'Las características permitidas son "Piscina", "Terraza" o "Garaje".',
  }),

  nombre: Joi.string().max(50).required().messages({
    'string.empty': 'El nombre no puede estar vacío.',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres.',
    'any.required': 'El nombre es un campo requerido.',
  }),

  Apellidos: Joi.string().max(50).required().messages({
    'string.empty': 'Los apellidos no pueden estar vacíos.',
    'string.max': 'Los apellidos no pueden tener más de {#limit} caracteres.',
    'any.required': 'Los apellidos son un campo requerido.',
  }),

  correo: Joi.string().email().required().messages({
    'string.email': 'El correo debe ser un email válido.',
    'string.empty': 'El correo no puede estar vacío.',
    'any.required': 'El correo es un campo requerido.',
  }),

  telefono: Joi.string().pattern(/^[0-9]{7,15}$/).required().messages({
    'string.pattern.base': 'El teléfono debe contener entre 7 y 15 dígitos.',
    'string.empty': 'El teléfono no puede estar vacío.',
    'any.required': 'El teléfono es un campo requerido.',
  }),

  contactar: Joi.array().items(Joi.string().valid('Mañana', 'Tarde', 'Noche')).required().messages({
    'array.base': 'El horario de contacto debe ser un arreglo.',
    'any.only': 'Los horarios de contacto permitidos son "Mañana", "Tarde" o "Noche".',
    'any.required': 'El horario de contacto es un campo requerido.',
  }),
});

export { valorarPropiedadesSchema };
