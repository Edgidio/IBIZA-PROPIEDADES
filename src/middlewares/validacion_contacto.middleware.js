import { contactoSchema } from '../validators/validacion_contacto.js'

import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const validacion_contacto = async (req, res, next) => {

  const { nombre, correo, asunto, mensaje } = req.body;

  const { error } = contactoSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Hay errores de validación
    const errors = error.details.map((err) => {
      return {
        field: err.context.label,
        message: err.message, // <-- Corregido aquí
      };      

    });

    return res.render("partials/frontend/contacto", {
        Titulo: "Ibiza propiedades | Contacto",
        errors, 
        datos_formulario: { nombre, correo, asunto, mensaje },
        rutaIF: "Frontend"
    })

    
  }

  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validacion_contacto };