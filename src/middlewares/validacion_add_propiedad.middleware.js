import { add_propiedadSchema } from '../validators/validacion_add_propiedad.js'
import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const  validacion_add_propiedad = async (req, res, next) => {

  const { id, tipo_propiedad, venta_renta, descripcion, detalles, estado , ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, maletero, estacionamiento} = req.body;


  const { error } = add_propiedadSchema.validate(req.body, { abortEarly: false });

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

    console.log(errors)

    return res.render("partials/dashboard/anadir_propiedad", {
        Titulo: "Ibiza Prop | Añadir propiedad",
        Inicios_de_sesiones: Inicios_de_sesiones,
        N_inicios,
        ruta: "/crear-propietario",
        errors, 
        datos_formulario: { id, tipo_propiedad, venta_renta, descripcion, detalles,estado , ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, estacionamiento, maletero},
        rutaIF: "Backend",
        N_correos,
        Correos
    })

    
  }

  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validacion_add_propiedad };