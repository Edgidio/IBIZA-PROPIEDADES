import { createPropietario } from '../validators/validacion_crear_propietario.js';
import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const validate_crear_propietario = async (req, res, next) => {

  const { cedula, nombres, apellidos, telefono, correo } = req.body;

  const { error } = createPropietario.validate(req.body, { abortEarly: false });

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

  if (error) {
    // Hay errores de validación
    const errors = error.details.map((err) => {
      return {
        field: err.context.label,
        message: err.message, // <-- Corregido aquí
      };      

    });

    return res.render("partials/dashboard/crear-propietario", {
        Titulo: "Ibiza Prop | Crear propietario",
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
        rutaIF: "Backend"
    })

    
  }

  const usuarioExistente = await db.propietarios.findUnique({
    where: {
      cedula: parseInt(cedula),
    },
  });

  if (usuarioExistente) {

    req.flash("req_propietario_existe", "El propietario no pudo ser registrado debido a que ya existe un número de cédula registrado en nuestro sistema. Por favor, verifique la información proporcionada")

    return res.render("partials/dashboard/crear-propietario", {
      Titulo: "Ibiza Prop | Crear propietario",
      Inicios_de_sesiones: Inicios_de_sesiones,
      N_inicios,
      ruta: "/crear-propietario",
      datos_formulario: {
          cedula,
          nombres,
          apellidos,
          telefono,
          correo
      },
      rutaIF: "Backend",
      req_propietario_existe:req.flash("req_propietario_existe")
  })
  }

  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validate_crear_propietario };