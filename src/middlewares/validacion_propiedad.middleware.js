import { lenguaje } from "../helpers/languaje.js";
import { correos_propiedadSchema } from "../validators/validacion_propiedad.js"; 
import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

// Middleware para validar el formulario de inicio de sesión
const  validacion_correo_propiedad = async (req, res, next) => {

    const { id } = req.params;

    // Verificar si el parámetro es un número
    if (isNaN(id)) {
    // Redirigir a la página deseada si no es un número
        return res.redirect('/');
    }

  const {...DatosFormulario} = req.body;

  const { error } = correos_propiedadSchema.validate(req.body, { abortEarly: false });

  if (error) {

    // Hay errores de validación
    const errors = error.details.map((err) => {
      return {
        field: err.context.label,
        message: err.message, // <-- Corregido aquí
      };      

    });

      try {

    const propiedadId = parseInt(req.params.id);

    // Validar si el parámetro es un número
    if (isNaN(propiedadId)) {
      // Redireccionar a otra página si el parámetro no es un número
      return res.redirect('/pagina-no-encontrada');
    }

    if (propiedadId >= 2000000000) {
      // Redireccionar a otra página si el es mayor al escrito
      return res.redirect('/pagina-no-encontrada');
    }

    const propiedad_existe = await db.propiedades.findUnique({
      where: {
        id: propiedadId,
    }});


    // Validar si la propiedad existe
    if (!propiedad_existe) {
      // Redireccionar a otra página si la propiedad no existe
      return res.redirect('/pagina-no-encontrada');
    }

    const propiedadConFotos = await db.propiedades.findUnique({
      where: {
        id: propiedadId,
      },
      include: {
        fotos: {
          select: {
            rutas: true,
            createdAt: true,
            updatedAt: true,
          },
          take: 3, // Tomar solo 3 fotos
        },
      },
    });
    
    // Verificar si la propiedad tiene fotos
    const fotosPropiedad = propiedadConFotos?.fotos?.length > 0
      ? propiedadConFotos.fotos[0].rutas
      : [];
    
    // Tomar solo 3 
    const fotosLimitadas = fotosPropiedad.length > 0 ? fotosPropiedad.slice(0, 3) : [];
    const todasLasFotos = propiedadConFotos?.fotos?.[0].rutas || []; 
    
    // Propiedades relacionadas
    const tipoPropiedadDeseado = propiedadConFotos.tipo_propiedad;

    const propiedades = await db.$queryRaw`
    SELECT p.*, pi.rutas
    FROM "Propiedades" p
    LEFT JOIN "Propiedades_img" pi ON p.id = pi.id_propiedad
    WHERE p.tipo_propiedad = ${tipoPropiedadDeseado}
    ORDER BY RANDOM()
    LIMIT 3
  `;

  // Itera sobre cada propiedad en el array y selecciona solo una ruta de imagen
  const propiedadesConRutaUnica = propiedades.map((propiedad) => {
    const primeraRuta = propiedad.rutas[0];

    // Crea un nuevo objeto con la información de la propiedad y la ruta seleccionada
    return {
        id: propiedad.id,
        id_propietario: propiedad.id_propietario,
        descripcion: propiedad.descripcion,
        detalles: propiedad.detalles,
        ubicacion: propiedad.ubicacion,
        precio: propiedad.precio,
        venta_renta: propiedad.venta_renta,
        n_habitaciones: propiedad.n_habitaciones,
        n_banos: propiedad.n_banos,
        superficie: propiedad.superficie,
        terreno: propiedad.terreno,
        tipo_propiedad: propiedad.tipo_propiedad,
        vendida: propiedad.vendida,
        createdAt: propiedad.createdAt,
        updatedAt: propiedad.updatedAt,
        usuarioId: propiedad.usuarioId,
        estado: propiedad.estado,
        // Solo incluye la ruta seleccionada en el nuevo objeto
        rutas: primeraRuta,
      };
  });

  const t = await lenguaje(req, "propiedad.json")

  return res.render('partials/frontend/propiedad', {
    Titulo: "Error | Propiedad",
    rutaIF: "Frontend",
    primeraFotoS: fotosLimitadas[0],
    propiedadConFotos,
    fotosLimitadas,
    fotosPropiedad: todasLasFotos,
    propiedadesConRutaUnica,
    t,
    errors,
    datos_formulario: {name: DatosFormulario.name, email: DatosFormulario.email, phone: DatosFormulario.phone}
  });

  } catch (error) {

    res.status(500).json({ error: 'Error interno del servidor' });
  }

    
  }

  // La validación fue exitosa, continuar con la ejecución normal
  next();
};

export { validacion_correo_propiedad};