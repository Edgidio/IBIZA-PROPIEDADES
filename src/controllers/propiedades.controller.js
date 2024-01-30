import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

export const obtenerPropiedadGET = async (req, res) => {
    const propiedadId = parseInt(req.params.id);
  
    try {
      const propiedad = await db.propiedades.findUnique({
        where: {
            id: propiedadId,
        },
      });
  
      if (!propiedad) {
        res.status(404).json({ error: 'Propiedad no encontrada' });
      } else {
        res.json(propiedad);
      }
    } catch (error) {
      console.error('Error al obtener propiedad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerPropiedadesDePropietario = async (req, res) => {
    const idPropietario = parseInt(req.params.id_propietario);
  
    try {
      const propiedadesDelPropietario = await db.propiedades.findMany({
        where: {
            id_propietario: idPropietario,
        },
      });
  
      res.json(propiedadesDelPropietario);

    } catch (error) {
      console.error('Error al obtener propiedades del propietario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const obtenerPropiedadesGET = async (req, res) => {


      try {

        const propiedadesConImagenesYPropietario = await db.propiedades.findMany({
          include: {
            fotos: true,
            propietario: true,
          },
        });

        const N_inicios = await db.log_sesiones.count({
            where: {
            visto: false,
            },
        });

    
        res.render("partials/dashboard/propiedades", {
            Titulo: "Ibiza Prop | Propiedades",
            N_inicios,
            ruta: "/usuarios",
            rutaIF: "Backend",
            propiedadesConImagenesYPropietario
        })
        
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
};

export const crearPropiedadPOTS = async (req, res) => {
 const { propietario, descripcion, detalles, ubicacion, precio, venta_renta, n_habitaciones, n_banos, superficie, terreno, tipo_propiedad, vendida, cedula } = req.body;

  try {

    const propiedadCreada = await db.propiedades.create({
      data: {
        id_propietario: parseInt(cedula),
        descripcion,
        detalles,
        ubicacion,
        precio: parseFloat(precio),
        venta_renta,
        n_habitaciones: parseInt(),
        n_banos: parseInt(),
        superficie: parseFloat(),
        terreno: parseFloat(),
        tipo_propiedad,
        vendida
      },
    });

    res.json({ mensaje: 'Propiedad creada con éxito', propiedadCreada });

  } catch (error) {

    console.error('Error al crear propiedad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });

  }
};

export const eliminarPropiedadDELETE = async (req, res) => {
    const propiedadId = parseInt(req.params.id);
  
    try {
      // Verifica si la propiedad existe antes de intentar eliminarla
      const propiedadExistente = await db.propiedades.findUnique({
        where: {
          id: propiedadId,
        },
      });
  
      if (!propiedadExistente) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
  
      // Elimina la propiedad
      const propiedadEliminada = await db.propiedades.delete({
        where: {
          id: propiedadId,
        },
      });
  
      res.json({
        mensaje: 'Propiedad eliminada con éxito',
        propiedadEliminada,
      });
    } catch (error) {
      console.error('Error al eliminar propiedad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const actualizarPropiedadesPUT = async (req, res) => {
    const propiedadId = parseInt(req.params.id);
  
    try {
      // Verifica si la propiedad existe antes de intentar actualizarla
      const propiedadExistente = await db.propiedades.findUnique({
        where: {
          id: propiedadId,
        },
      });
  
      if (!propiedadExistente) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
  
      // Extrae los campos que se pueden actualizar del cuerpo de la solicitud
      const { descripcion, detalles, ubicacion, precio, n_habitaciones, n_banos, superficie, terreno, tipo_propiedad, vendida, venta_renta } = req.body;
  
      // Actualiza la propiedad con los campos proporcionados
      const propiedadActualizada = await db.propiedades.update({
        where: {
          id: propiedadId,
        },
        data: {
            descripcion,
            detalles,
            ubicacion,
            precio: parseFloat(precio),
            venta_renta,
            n_habitaciones: parseInt(),
            n_banos: parseInt(),
            superficie: parseFloat(),
            terreno: parseFloat(),
            tipo_propiedad,
            vendida
        },
      });
  
      res.json({
        mensaje: 'Propiedad actualizada con éxito',
        propiedadActualizada,
      });
    } catch (error) {
      console.error('Error al actualizar propiedad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};

    