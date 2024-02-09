import { actualizarPropietario } from '../validators/validacion_actualizar_propietario.js';
import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const validate_actualizar_propietario = async (req, res, next) => {

  const { cedula, nombres, apellidos, telefono, correo } = req.body;

  const { error } = actualizarPropietario.validate(req.body, { abortEarly: false });

 // Informacion para la navegacion necesaria    
 const Inicios_de_sesiones = await db.log_sesiones.findMany({
  where: {
      visto: false
  }
});

const N_inicios = await db.log_sesiones.count({
      where: {
      visto: false,
      },
  });

const Correos = await db.correos_ibiza.findMany({
  where: {
      visto: false
  }
});

const N_correos = await db.correos_ibiza.count({
  where: {
  visto: false,
  },
});
// FIN Informacion para la navegacion necesaria 

  if (error) {
    // Hay errores de validación
    const errors = error.details.map((err) => {
      return {
        field: err.context.label,
        message: err.message, // <-- Corregido aquí
      };      

    });

    return res.render("partials/dashboard/propietario_actualizar", {
        Titulo: "Ibiza Prop | Actualizar propietario",
        Inicios_de_sesiones: Inicios_de_sesiones,
        N_inicios,
        ruta: "/crear-propietario",
        errors, 
        datos_formulario: {
            cedula,
            nombres,
            apellidos,
            telefono,
            correo
        },
        rutaIF: "Backend",
        N_correos,
        Correos
    })

    
  }

  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validate_actualizar_propietario };