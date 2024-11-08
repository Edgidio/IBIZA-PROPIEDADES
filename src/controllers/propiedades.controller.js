import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

import path from 'path';
import fs from 'fs-extra';
import {__dirname} from '../app.js'

export const obtenerPropiedadGET = async (req, res) => {
  
    try {

      const propiedadId = parseInt(req.params.id);

      const propiedad = await db.propiedades.findUnique({
        where: {
            id: propiedadId,
        },
      });
  
      if (!propiedad) {
        return res.redirect("/admin-ibizapropiedades-dashboard/")
      } 


      const propiedades = await db.propiedades.findMany({
        where: {
          id: propiedadId,
        },
        include: {
          fotos: true,
          propietario: true,
          usuario: true
        },
      });
      
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
        const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
      
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
          imagenes: propiedades[0].fotos[0].rutas,
          propietario: propiedad.propietario,
          usuario: propiedad.usuario.usuario,
          rutas: primeraRuta
        };
      });
  
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

      return res.render("partials/dashboard/propiedad", {
        Titulo: "Ibiza Prop | Propiedad",
        N_inicios,
        rutaIF: "Backend",
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica[0],
        Correos,
        N_correos,
        Inicios_de_sesiones: Inicios_de_sesiones,

    })

    } catch (error) {
                // Manejo de errores y redirección en caso de problemas
                await db.log_sistema.create({
                  data: {
                      controlador: "obtenerPropiedadGET",
                      error: error.toString()
                  },
              });
    
              req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
              return res.redirect("/admin-ibizapropiedades-dashboard/")
    }
};

// Controladores por eliminar
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

// Fin controladores por eliminar

export const eliminarPropiedadDELETE = async (req, res) => {

  try {

    const propiedadId = parseInt(req.params.id);

    // Verifica si la propiedad existe antes de intentar eliminarla
    const propiedadExistente = await db.propiedades.findUnique({
      where: {
        id: propiedadId,
      },
      include: {
        fotos: true, // Incluye la relación de fotos
      },
    });

    if (!propiedadExistente) {
      return res.redirect("/admin-ibizapropiedades-dashboard")
    }

    // Define las carpetas de imágenes
    const carpetasImagenes = [
      '/images/uploads/propiedades/large/',
      '/images/uploads/propiedades/medium/',
      '/images/uploads/propiedades/original/',
      '/images/uploads/propiedades/small/',
    ];

    // Elimina las imágenes asociadas a la propiedad
    for (const imagen of propiedadExistente.fotos) {
      for (const carpetaImagenes of carpetasImagenes) {
        if (Array.isArray(imagen.rutas)) {
          for (const ruta of imagen.rutas) {
            const rutaCompleta = path.join(__dirname, 'public', carpetaImagenes, ruta);
            try {
              
              await fs.unlink(rutaCompleta);
              
            } catch (error) {
              return false
            }
          }
        } else {
          const rutas = imagen.rutas.split(',');
          for (const ruta of rutas) {
            const rutaCompleta = path.join(__dirname, 'public', carpetaImagenes, ruta);
            try {
              
              await fs.unlink(rutaCompleta);
              
            } catch (error) {
              return false
            }
          }
        }
      }
    }

    // Elimina la relación con las imágenes antes de eliminar la propiedad
    await db.propiedades_img.deleteMany({
      where: {
        id_propiedad: propiedadId,
      },
    });

    // Finalmente, elimina la propiedad
    await db.propiedades.delete({
      where: {
        id: propiedadId,
      },
    });

    let tipo_propiedad_c = propiedadExistente.tipo_propiedad

      switch (tipo_propiedad_c) {
        case 'C':
            tipo_propiedad_c = 'casas';
            break;
        case 'A':
            tipo_propiedad_c = 'apartamentos';
            break;
        case 'L':
            tipo_propiedad_c = 'local-comercial';
            break;
        case 'O':
            tipo_propiedad_c = 'oficinas';
            break;
        case 'T':
            tipo_propiedad_c = 'terrenos';
            break;
        case 'E':
            tipo_propiedad_c = 'edificios';
            break;
        case 'P':
            tipo_propiedad_c = 'penthouses';
            break;
        case 'H':
            tipo_propiedad_c = 'townhouses';
            break;
        case 'G':
            tipo_propiedad_c = 'galpones';
            break;
        default:
            tipo_propiedad_c = '/admin-ibizapropiedades-dashboard/';
      }

      req.flash("delete_propiedad", "La propiedad ha sido eliminada con éxito.")
  
      return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/${tipo_propiedad_c}`)

  } catch (error) {

      console.log(error, "El errror")
    
       // Manejo de errores y redirección en caso de problemas
       await db.log_sistema.create({
        data: {
            controlador: "eliminarPropiedadDELETE",
            error: error.toString()
        },
    });

    req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

    return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/${tipo_propiedad_c}`)

  } finally {
    await db.$disconnect(); // Cierra la conexión a la base de datos al finalizar la operación
  }
};

export const actualizarPropiedadesGET = async (req, res) => {
  
  try {

    const propiedadId = parseInt(req.params.id);
    // Verifica si la propiedad existe antes de intentar actualizarla
    const propiedadExistente = await db.propiedades.findUnique({
      where: {
        id: propiedadId,
      },
    });

    if (!propiedadExistente) {
      return res.redirect("/admin-ibizapropiedades-dashboard")
    }

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


    return res.render("partials/dashboard/propiedad-actualizar", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        propiedadExistente,
        Correos,
        N_correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedadId

    })

  } catch (error) {
           // Manejo de errores y redirección en caso de problemas
           await db.log_sistema.create({
            data: {
                controlador: "actualizarPropiedadesGET",
                error: error.toString()
            },
        });
    
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
        return res.redirect(`/admin-ibizapropiedades-dashboard`)
  }
};

export const actualizarPropiedadesPUT = async (req, res) => {

  console.log("ACTUALZIAR LLEGO")
  
    try {

      const propiedadId = parseInt(req.params.id); 
      
      // Extrae los campos que se pueden actualizar del cuerpo de la solicitud
      const { descripcion, detalles, ubicacion, precio, n_habitaciones, n_banos, superficie, terreno, tipo_propiedad, vendida, venta_renta, estado, maletero, estacionamiento } = req.body;

      const propiedadExistente = await db.propiedades.findUnique({
        where: {
          id: propiedadId,
        },
      });
  
      if (!propiedadExistente) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
  
      // Actualiza la propiedad con los campos proporcionados
      const propiedadActualizada = await db.propiedades.update({
        where: {
          id: propiedadId,
        },
        data: {
          descripcion,
          detalles,
          ubicacion,
          precio: isNaN(parseFloat(precio)) ? null : parseFloat(precio),
          venta_renta,
          n_habitaciones: isNaN(parseInt(n_habitaciones)) ? null : parseInt(n_habitaciones),
          n_banos: isNaN(parseInt(n_banos)) ? null : parseInt(n_banos),
          superficie: isNaN(parseFloat(superficie)) ? null : parseFloat(superficie),
          terreno: isNaN(parseFloat(terreno)) ? null : parseFloat(terreno),
          tipo_propiedad,
          vendida,
          maletero: parseFloat(maletero) || 0,
          estacionamiento: parseFloat(estacionamiento) || 0,   
        },
      });

      let tipo_propiedad_c = propiedadExistente.tipo_propiedad

      switch (tipo_propiedad_c) {
        case 'C':
            tipo_propiedad_c = 'casas';
            break;
        case 'A':
            tipo_propiedad_c = 'apartamentos';
            break;
        case 'L':
            tipo_propiedad_c = 'local-comercial';
            break;
        case 'O':
            tipo_propiedad_c = 'oficinas';
            break;
        case 'T':
            tipo_propiedad_c = 'terrenos';
            break;
        case 'E':
            tipo_propiedad_c = 'edificios';
            break;
        case 'P':
              tipo_propiedad_c = 'penthouses';
              break;
        case 'H':
              tipo_propiedad_c = 'townhouses';
              break;
        case 'G':
              tipo_propiedad_c = 'galpones';
              break;
        default:
              tipo_propiedad_c = '/admin-ibizapropiedades-dashboard/';
      }

      req.flash("update_propiedad", "La propiedad ha sido actualizada con éxito.")
  
      return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/${tipo_propiedad_c}`)

    } catch (error) {
      
     // Manejo de errores y redirección en caso de problemas
        await db.log_sistema.create({
          data: {
              controlador: "actualizarPropiedadesPUT",
              error: error.toString()
          },
      });

      req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

      return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/${tipo_propiedad_c}`)     


    }
};

export const obtenerPropiedadesCasasGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'C',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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

    res.render("partials/dashboard/casas", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")

    })
    
  } catch (error) {
     // Manejo de errores y redirección en caso de problemas
     await db.log_sistema.create({
      data: {
          controlador: "obtenerPropiedadesCasasGET",
          error: error.toString()
      },
  });

  req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

  return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/casas`)     
  }
};

export const obtenerPropiedadesApartamentoGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'A',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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


    res.render("partials/dashboard/apartamentos", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {

    console.log(error, )

         // Manejo de errores y redirección en caso de problemas
         await db.log_sistema.create({
          data: {
              controlador: "obtenerPropiedadesApartamentoGET",
              error: error.toString()
          },
      });
    
      req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
      return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/apartamentos`)  
  }
};

export const obtenerPropiedadesTerrenosGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'T',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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


    res.render("partials/dashboard/terrenos", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {
         // Manejo de errores y redirección en caso de problemas
         await db.log_sistema.create({
          data: {
              controlador: "obtenerPropiedadesTerrenosGET",
              error: error.toString()
          },
      });
    
      req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
      return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/terrenos`)  
  }
};

export const obtenerPropiedadesLocalComercialGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'L',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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


    res.render("partials/dashboard/local-comercial", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {
       // Manejo de errores y redirección en caso de problemas
       await db.log_sistema.create({
        data: {
            controlador: "obtenerPropiedadesLocalComercialGET",
            error: error.toString()
        },
    });
  
    req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
  
    return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/local-comercial`)  
  }
};

export const obtenerPropiedadesOficinasGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'O',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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


    res.render("partials/dashboard/oficinas", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {
           // Manejo de errores y redirección en caso de problemas
           await db.log_sistema.create({
            data: {
                controlador: "obtenerPropiedadesOficinasGET",
                error: error.toString()
            },
        });
      
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
      
        return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/oficinas`)  
  }
};

export const obtenerPropiedadesEdificiosGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'E',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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

    res.render("partials/dashboard/edificios", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {
               // Manejo de errores y redirección en caso de problemas
               await db.log_sistema.create({
                data: {
                    controlador: "obtenerPropiedadesEdificiosGET",
                    error: error.toString()
                },
            });
          
            req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
          
            return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/edificios`)  
  }
};

export const obtenerPropiedadesTownhousesGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'H',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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

    res.render("partials/dashboard/townhouse", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {
               // Manejo de errores y redirección en caso de problemas
               await db.log_sistema.create({
                data: {
                    controlador: "obtenerPropiedadesEdificiosGET",
                    error: error.toString()
                },
            });
          
            req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
          
            return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/edificios`)  
  }
};

export const obtenerPropiedadesPenthousesGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'P',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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

    res.render("partials/dashboard/penthouses", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {
               // Manejo de errores y redirección en caso de problemas
               await db.log_sistema.create({
                data: {
                    controlador: "obtenerPropiedadesEdificiosGET",
                    error: error.toString()
                },
            });
          
            req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
          
            return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/edificios`)  
  }
};

export const obtenerPropiedadesGalponesGET = async (req, res) => {


  try {

    const propiedades = await db.propiedades.findMany({
      where: {
        tipo_propiedad: 'G',
      },
      include: {
        fotos: true,
      },
    });
    
      const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
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
        rutas: primeraRuta,
        enExhibicion: propiedad.enExhibicion
      };
    });

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

    res.render("partials/dashboard/galpones", {
        Titulo: "Ibiza Prop | Propiedades",
        N_inicios,
        ruta: "/usuarios",
        rutaIF: "Backend",
        propiedadesConImagenesYPropietario: propiedadesConRutaUnica,
        update_propiedad: req.flash("update_propiedad"),
        N_correos,
        Correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        propiedad_exhibida:req.flash("propiedad_exhibida"),
        propiedad_desmarcar:req.flash("propiedad_desmarcar"),
        propiedad_exhibida_false:req.flash("propiedad_exhibida_false")
    })
    
  } catch (error) {
               // Manejo de errores y redirección en caso de problemas
               await db.log_sistema.create({
                data: {
                    controlador: "obtenerPropiedadesEdificiosGET",
                    error: error.toString()
                },
            });
          
            req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
          
            return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/edificios`)  
  }
};



export const marcarExhibicionPOS = async (req, res) => {


  try {


    const propiedadId = parseInt(req.params.id);

    let tipo_propiedad_c = req.body.tipo_propiedad

    switch (tipo_propiedad_c) {
      case 'C':
          tipo_propiedad_c = 'casas';
          break;
      case 'A':
          tipo_propiedad_c = 'apartamentos';
          break;
      case 'L':
          tipo_propiedad_c = 'local-comercial';
          break;
      case 'O':
          tipo_propiedad_c = 'oficinas';
          break;
      case 'T':
          tipo_propiedad_c = 'terrenos';
          break;
      case 'E':
          tipo_propiedad_c = 'edificios';
          break;
      case 'P':
          tipo_propiedad_c = 'penthouses';
          break;
      case 'H':
          tipo_propiedad_c = 'townhouses';
          break;
      case 'G':
          tipo_propiedad_c = 'galpones';
          break;
      default:
          tipo_propiedad_c = '/admin-ibizapropiedades-dashboard/';
    }
    
    // Antes de marcar una propiedad como en exhibición, verifica si ya hay tres
    const propiedadesEnExhibicion = await db.propiedades.count({
      where: { enExhibicion: true }
    });

    if (propiedadesEnExhibicion >= 3) {

      req.flash("propiedad_exhibida_false", "No se pueden exhibir más de 3 propiedades al mismo tiempo. Por favor, desmarque una propiedad existente en exhibición antes de intentar exhibir esta propiedad. Puede hacerlo haciendo clic en el botón 'Anular' de una propiedad ya marcada.")

      return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/${tipo_propiedad_c}`)

    } else {

      await db.propiedades.update({
        where: { id: propiedadId },
        data: { enExhibicion: true }
      });
  
      req.flash("propiedad_exhibida", "La propiedad ha sido exhibida con éxito.")
  
      return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/${tipo_propiedad_c}`)

    }

    
  } catch (error) {

    console.log(error)

      // Manejo de errores y redirección en caso de problemas
      await db.log_sistema.create({
        data: {
            controlador: "marcarExhibicionPOS",
            error: error.toString()
        },
      });
    
      req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
      return res.redirect(`/admin-ibizapropiedades-dashboard/`)  
  }
};

export const desmarcarExhibicionPOS = async (req, res) => {


  try {

    const propiedadId = parseInt(req.params.id);

    let tipo_propiedad_c = req.body.tipo_propiedad

    switch (tipo_propiedad_c) {
      case 'C':
          tipo_propiedad_c = 'casas';
          break;
      case 'A':
          tipo_propiedad_c = 'apartamentos';
          break;
      case 'L':
          tipo_propiedad_c = 'local-comercial';
          break;
      case 'O':
          tipo_propiedad_c = 'oficinas';
          break;
      case 'T':
          tipo_propiedad_c = 'terrenos';
          break;
      case 'E':
          tipo_propiedad_c = 'edificios';
          break;
      case 'P':
          tipo_propiedad_c = 'penthouses';
          break;
      case 'H':
          tipo_propiedad_c = 'townhouses';
          break;
      case 'G':
          tipo_propiedad_c = 'galpones';
          break;
      default:
          tipo_propiedad_c = '/admin-ibizapropiedades-dashboard/';
    }
    

    await db.propiedades.update({
      where: { id: propiedadId },
      data: { enExhibicion: false }
    });

    req.flash("propiedad_desmarcar", "La propiedad ha sido desmarcada con éxito.")

    return res.redirect(`/admin-ibizapropiedades-dashboard/propiedades/${tipo_propiedad_c}`)
 
  } catch (error) {

      // Manejo de errores y redirección en caso de problemas
      await db.log_sistema.create({
        data: {
            controlador: "desmarcarExhibicionPOS",
            error: error.toString()
        },
      });
    
      req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
      return res.redirect(`/admin-ibizapropiedades-dashboard/`)  
  }
};
