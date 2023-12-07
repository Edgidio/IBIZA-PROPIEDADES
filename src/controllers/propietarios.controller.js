import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

export const obtenerPropietariosGET = async (req, res) => {
    try {
        const propietarios = await Promise.all(
          propietarioss.map(async (propietario) => {
            const propietarioConCasas = await db.propietarios.findUnique({
              where: {
                cedula: propietario.cedula,
              },
              select: {
                cedula: true,
                nombres: true,
                apellidos: true,
                telefono: true,
                correo: true,
                casas: {
                  select: {
                    id: true,
                  },
                },
              },
            });
        
            const cantidadPropiedades = propietarioConCasas.casas.length;
        
            return {
              ...propietarioConCasas,
              cantidadPropiedades,
            };
          })
        );
    
        console.log(propietarios)
          /* const propietarios = await db.propietarios.findMany(); */
    
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
      
          res.render("partials/dashboard/propietarios", {
            Titulo: "Ibiza Prop | Listar propietarios",
            Inicios_de_sesiones: Inicios_de_sesiones,
            N_inicios,
            ruta: "/usuarios",
            propietarioEliminado: req.flash('usuarioEliminado'),
            propietarios
          })
    
        } catch (error) {
    
          console.log(error)
          
          res.send(`<h3 style="color: tomato; text-align: center;">Detectamos un error no validado en las respuestas HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.</h3> ${error}`)
             .status(500)
      }
};

export const crearPropietarioGET = async (req, res) => {
    try {

        const N_inicios = await db.log_sesiones.count({
            where: {
            visto: false,
            },
        });
    
        res.render("partials/dashboard/crear-propietario", {
            Titulo: "Ibiza Prop | Crear propietario",
            N_inicios,
            ruta: "/usuarios",
        })
        
    } catch (error) {
    
         
    }
};

export const crearPropietarioPOST = async (req, res) => {
    const { cedula, nombres, apellidos, telefono, correo } = req.body;
  
    try {

      const propietarioCreado = await db.propietarios.create({
        data: {
          cedula: parseInt(cedula),
          nombres,
          apellidos,
          telefono,
          correo,
        },
      });

      // Almacena la información en la sesión
      req.session.data_propietario = propietarioCreado;
      req.flash("nuevo_propietario", "Propietario creado satisfactoriamente")

      res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear/propiedad")

    } catch (error) {
      console.error('Error al crear propietario:', error);
      res.status(500).json({ error: 'Detectamos un error no validado en las respuestas HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.' });
    }
};

export const crearPropietarioPropiedadGET = async (req, res) => {
    const cedula_propietario = req.session.data_propietario

    if (!cedula_propietario){
      return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear/")
    }
  
    const N_inicios = await db.log_sesiones.count({
         where: {
         visto: false,
         },
     });
  
   res.render("partials/dashboard/crear-propietario-propiedad", {
     Titulo: "Ibiza Prop | Crear propiedad",
     N_inicios,
     ruta: "/usuarios",
     req_nuevo_propietario: req.flash("nuevo_propietario")
   })
};

export const crearPropietarioPropiedadPOST = async (req, res) => {
    try {

        const { tipo_propiedad, venta_renta, descripcion, detalles, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, fotos } = req.body;
        /* const userId = req.user.id; */
        const cedula_propietario = req.session.data_propietario.cedula
    
    
        // Ejemplo de creación de una propiedad en la base de datos
        const nuevaPropiedad = await db.propiedades.create({
          data: {
            /* usuarioId: userId, */
            id_propietario: cedula_propietario,
            tipo_propiedad,
            venta_renta,
            descripcion,
            detalles,
            ubicacion,
            precio: parseFloat(precio) || 0,
            n_habitaciones: parseFloat(n_habitaciones) || 0,
            n_banos: parseFloat(n_banos) || 0,
            terreno: parseFloat(terreno) || 0,
            superficie: parseFloat(superficie) || 0,
            fotos: {
              create: [
                {
                  ruta_imagen_propiedad: "ruta_de_la_imagen.jpg",
                  cantidad_img: 1
                }
              ]
            }
          },
        });
    
        } catch (error) {
          console.error('Error al eliminar propietario y sus propiedades:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
     
};

export const eliminarPropietarioDELETE = async (req, res) => {
        /* try {

        const propietarioId = parseInt(req.params.id);  

        const propietarioEliminado = await db.propietarios.delete({
            where: {
            cedula: propietarioId,
            },
        });
    
        res.json({ mensaje: 'Propietario eliminado con éxito', propietarioEliminado });
    } catch (error) {
        console.error('Error al eliminar propietario:', error);
        res.status(500).json({ error: 'Detectamos un error no validado en las respuestas HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.' });
    } */

  const idPropietario = parseInt(req.params.id);

  try {
    // Verifica si el propietario existe antes de intentar eliminarlo
    const propietarioExistente = await db.propietarios.findUnique({
      where: {
        cedula: idPropietario,
      },
    });

    if (!propietarioExistente) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    // Elimina todas las propiedades asociadas al propietario
    await db.propiedades.deleteMany({
      where: {
        id_propietario: idPropietario,

      },
    });

    // Elimina al propietario
    const propietarioEliminado = await db.propietarios.delete({
      where: {
        cedula: idPropietario,
      },
    });

    res.json({
      mensaje: 'Propietario y todas sus propiedades eliminadas con éxito',
      propietarioEliminado,
    });
  } catch (error) {
    console.error('Error al eliminar propietario y sus propiedades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
     
};

export const actualizarPropietarioPUT = async (req, res) => {
    const propietarioId = parseInt(req.params.id);
    const { cedula, nombres, apellidos, telefono, correo} = req.body;
  
    try {
      const datosActualizados = {
        nombres,
        apellidos,
        telefono,
        correo
      };
  
      const propietarioActualizado = await db.propietarios.update({
        where: {
          cedula: propietarioId,
        },
        data: datosActualizados,
      });
  
      res.json({ mensaje: 'Propietario actualizado con éxito', propietarioActualizado });
    } catch (error) {
      console.error('Error al actualizar propietario:', error);
      res.status(500).json({ error: 'Detectamos un error no validado en las respuestas HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.' });
    }
 
};