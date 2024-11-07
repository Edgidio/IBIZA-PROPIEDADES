import { valorarPropiedadesSchema } from '../validators/validacion_valora_su_propiedad.js'

import {PrismaClient} from "@prisma/client"

import {lenguaje} from "../helpers/languaje.js"

const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const validacion_valora_su_propiedd = async (req, res, next) => {

  const tt = await lenguaje(req, "valora_tu_propiedad.validar.json")

  const { ...datos_formulario } = req.body;


  if (!Array.isArray(datos_formulario.contactar)) {

    req.body.contactar = [req.body.contactar]
    // Si contactar es un string, lo convertimos en un array
    datos_formulario.contactar = [datos_formulario.contactar];

  }

  if (!Array.isArray(datos_formulario.caracteristica)) {

    req.body.caracteristica = [req.body.caracteristica]
    // Si contactar es un string, lo convertimos en un array
    datos_formulario.caracteristica = [datos_formulario.caracteristica];

  }

  // Validar con Joi usando los mensajes correspondientes al idioma
  const { error } = valorarPropiedadesSchema(tt).validate(req.body, { abortEarly: false });

  
  if (error) {
    const errors = error.details.map((err) => {
      return {
        field: err.context.label,
        message: err.message, // Mensajes traducidos
      };
    });

    const t = await lenguaje(req, "valora_tu_propiedad.json")

    

    console.log("ERRORRRRR", errors[7].field,)

    return res.render('partials/frontend/venda_su_propiedad', {
        Titulo: "Ibiza Propiedades | Venda su propiedad",
        rutaIF: "Frontend",
        errors,
        datos_formulario: datos_formulario,
        t
      });
  }
  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validacion_valora_su_propiedd };