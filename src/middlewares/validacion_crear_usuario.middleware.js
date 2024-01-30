import { createUserSchema } from '../validators/validacion_crear_usuario.js';
import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const validate_crear_usuaurio = async (req, res, next) => {

  const { error } = createUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Hay errores de validación
    const errors = error.details.map((err) => {
      return {
        field: err.context.label,
        message: err.message, // <-- Corregido aquí
      };      

    });

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
  
    return res.render("partials/dashboard/crear-usuario", {
        Titulo: "Ibiza Prop | Crear usuario administrador",
        Inicios_de_sesiones: Inicios_de_sesiones,
        N_inicios,
        ruta: "/crear-usuarios",
        errors, 
        datos_formulario: {
            usuario: req.body.usuario,
            password: req.body.password,
            passwordr: req.body.passwordr
        },
        rutaIF: "Backend"
    })



  }

  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validate_crear_usuaurio };