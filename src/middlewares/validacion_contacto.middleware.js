import { contactoSchema } from '../validators/validacion_contacto.js'

import {PrismaClient} from "@prisma/client"

import {lenguaje} from "../helpers/languaje.js"

const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const validacion_contacto = async (req, res, next) => {

  const tt = await lenguaje(req, "contacto.validar.json")

  const { nombre, correo, asunto, mensaje } = req.body;

  // Validar con Joi usando los mensajes correspondientes al idioma
  const { error } = contactoSchema(tt).validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => {
      return {
        field: err.context.label,
        message: err.message, // Mensajes traducidos
      };
    });

    const t = await lenguaje(req, "contacto.json")

    return res.render("partials/frontend/contacto", {
      Titulo: "Ibiza propiedades | Contacto",
      errors,
      datos_formulario: { nombre, correo, asunto, mensaje },
      rutaIF: "Frontend",
      t
    });
  }
  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validacion_contacto };