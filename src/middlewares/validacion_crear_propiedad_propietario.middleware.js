import { crear_propiedad_propietarioSchema } from '../validators/validacion_crear_propiedad_propietario.js'
import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const validacion_crear_propiedad_propietario = async (req, res, next) => {

  const { tipo_propiedad, venta_renta, descripcion, detalles, estado , ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, fotos } = req.body;

  const { error } = crear_propiedad_propietarioSchema.validate(req.body, { abortEarly: false });

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

    console.log(errors, "Va")

    return res.render("partials/dashboard/crear-propietario-propiedad", {
        Titulo: "Ibiza Prop | Crear propiedad",
        Inicios_de_sesiones: Inicios_de_sesiones,
        N_inicios,
        ruta: "/crear-propietario",
        errors, 
        datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles,estado , ubicacion, precio, n_habitaciones, n_banos, terreno, superficie },
        rutaIF: "Backend",
        N_correos,
        Correos
    })

    
  }

  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validacion_crear_propiedad_propietario };