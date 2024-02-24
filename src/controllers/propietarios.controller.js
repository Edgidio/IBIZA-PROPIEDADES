import {PrismaClient} from "@prisma/client"
import gm from 'gm';
import {__dirname} from '../app.js'
import sizeOf from 'image-size';
import path from 'path';
import fs from 'fs-extra';

const db = new PrismaClient();

export const obtenerPropietariosGET = async (req, res) => {
    try {

          const propietariosConPropiedades = await db.propietarios.findMany({
            include: {
              casas: true, // Incluye todas las propiedades relacionadas
            },
          });

          // Crea un nuevo array de objetos con el número de propiedades
          const propietariosConConteo = propietariosConPropiedades.map((propietario) => {
            return {
              ...propietario,
              numeroDePropiedades: propietario.casas.length,
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

      
          return res.render("partials/dashboard/propietarios", {
            Titulo: "Ibiza Prop | Propietarios",
            Inicios_de_sesiones: Inicios_de_sesiones,
            N_inicios,
            propietarioEliminado: req.flash('usuarioEliminado'),
            propietarios: propietariosConConteo,
            rutaIF: "Backend",
            N_correos,
            Correos,
            propietario_eliminado:req.flash("propietario_eliminado"),
            usuario_update:req.flash("usuario_update")[0]
          })
    
        } catch (error) {
    
          // Manejo de errores y redirección en caso de problemas
            await db.log_sistema.create({
              data: {
                  controlador: "obtenerPropietariosGET",
                  error: error.toString()
              },
          });

          req.flash('error_controlador', 'Hubo un problema interno en el servidor');

          return res.redirect("/admin-ibizapropiedades-dashboard/propietarios");
      }
};

export const crearPropietarioGET = async (req, res) => {
    try {

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

        return res.render("partials/dashboard/crear-propietario", {
            Titulo: "Ibiza Prop | Crear propietario",
            Inicios_de_sesiones: Inicios_de_sesiones,
            N_inicios,
            ruta: "/usuarios",
            rutaIF: "Backend",
            propiedadC :req.flash('propiedadC'),
            N_correos,
            Correos,
            error_controlador: req.flash("error_controlador")[0]
            
        })
        
    } catch (error) {

          // Manejo de errores y redirección en caso de problemas
          await db.log_sistema.create({
            data: {
                controlador: "crearPropietarioGET",
                error: error.toString()
            },
        });

        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');

        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");   
         
    }
};

export const crearPropietarioPOST = async (req, res) => {
  
    try {

      const { cedula, nombres, apellidos, telefono, correo } = req.body;

      const propietarioCreado = await db.propietarios.create({
        data: {
          cedula: parseInt(cedula),
          nombres,
          apellidos,
          telefono,
          correo,
          nombre_creador: req.user.id.toString()
        },
      });

      // Almacena la información en la sesión
      req.session.data_propietario = propietarioCreado;
      req.flash("nuevo_propietario", "Propietario creado satisfactoriamente")

      return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear/propiedad")

    } catch (error) {
        // Manejo de errores y redirección en caso de problemas
        await db.log_sistema.create({
          data: {
              controlador: "crearPropietarioPOST",
              error: error.toString()
          },
        });

        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");   
    }
};

export const crearPropietarioPropiedadGET = async (req, res) => {

  try {

    const cedula_propietario = req.session.data_propietario

    if (!cedula_propietario){

      return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear/")

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
  
   return res.render("partials/dashboard/crear-propietario-propiedad", {
     Titulo: "Ibiza Prop | Crear propiedad",
     N_inicios,
     ruta: "/usuarios",
     req_nuevo_propietario: req.flash("nuevo_propietario"),
     rutaIF: "Backend",
     Correos,
     N_correos,
     Inicios_de_sesiones: Inicios_de_sesiones,
   })
    
  } catch (error) {
        // Manejo de errores y redirección en caso de problemas
        await db.log_sistema.create({
          data: {
              controlador: "crearPropietarioPropiedadGET",
              error: error.toString()
          },
        });

        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");   
  }

};

/* export const crearPropietarioPropiedadPOST = async (req, res) => {
    try {


        const { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie } = req.body;
        const cedula_propietario = req.session.data_propietario.cedula;
        const userId = req.user.id;
        const files = req.files;

        const isImagenValida = (filePath) => {

          try {

            const dimensions = sizeOf(filePath);
            return dimensions.width && dimensions.height;

          } catch (error) {

            return false;

          }
        };


    
        // Verifica si se han proporcionado archivos
        if (!files || files.length === 0) {
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
    
          return res.render("partials/dashboard/crear-propietario-propiedad", {
            Titulo: "Ibiza Prop | Crear propiedad",
            N_inicios,
            rutaIF: "Backend",
            Correos,
            N_correos,
            Inicios_de_sesiones: Inicios_de_sesiones,
            datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "No ha seleccionado ninguna imagen para la propiedad" }
          });
        }
    
        const processImage = async (file) => {
          const imagePath = path.join(__dirname, `public/images/uploads/propiedades/original/${file.filename}`);
        
          if (isImagenValida(imagePath)) {

            const dimensions = sizeOf(imagePath);
            const imagenGrande = path.join(__dirname, `public/images/uploads/propiedades/large/${file.filename}`);
            const imagenMediana = path.join(__dirname, `public/images/uploads/propiedades/medium/${file.filename}`);
            const imagenPequena = path.join(__dirname, `public/images/uploads/propiedades/small/${file.filename}`);
        
            try {
              // Desactiva el caché para cerrar el recurso después de su uso
              sharp.cache(false);
        
              await sharp(file.path).resize(800, 600).toFile(imagenGrande);
              await sharp(file.path).resize(400, 300).toFile(imagenMediana);
              await sharp(file.path).resize(200, 150).toFile(imagenPequena);

            } catch (sharpError) {
              return false;
            } finally {
              // Reactiva el caché después de su uso
              sharp.cache(true);
            }
        
            return true;

          } else {
            return false;
          }
        };
    
        // Procesar y guardar imágenes en diferentes tamaños
        for (const file of files) {

          const imageProcessed = await processImage(file);
    
          if (!imageProcessed) {

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
    
            return res.render("partials/dashboard/crear-propietario-propiedad", {
              Titulo: "Ibiza Prop | Crear propiedad",
              N_inicios,
              ruta: "/usuarios",
              rutaIF: "Backend",
              Inicios_de_sesiones: Inicios_de_sesiones,
              Correos,
              N_correos,
              datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "Por favor, selecciona archivos de imagen válidos." }
            });
          }
        }
    
        // Guardar la información principal en la base de datos
        const propiedad = await db.propiedades.create({
          data: {
            usuarioId: userId,
            id_propietario: cedula_propietario,
            tipo_propiedad,
            venta_renta,
            descripcion,
            detalles,
            ubicacion,
            estado: estado,
            usuarioId: userId,
            precio: parseFloat(precio) || 0,
            n_habitaciones: parseFloat(n_habitaciones) || 0,
            n_banos: parseFloat(n_banos) || 0,
            terreno: parseFloat(terreno) || 0,
            superficie: parseFloat(superficie) || 0,
          },
        });
    
        const img_propiedad = await db.propiedades_img.create({
          data: {
            id_propiedad: propiedad.id,
            rutas: req.files.map(file => file.filename),
          },
        });
    
        req.flash('propiedadC', "propietario creado satisfactoriamente");

        // Elimina la propiedad específica de la sesión
        delete req.session.data_propietario;
    
        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");


      } catch (error) {
        // Manejo de errores y redirección en caso de problemas
        await db.log_sistema.create({
          data: {
              controlador: "crearPropietarioPropiedadPOST",
              error: error.toString()
          },
        });

        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");   
      }
     
}; */

export const crearPropietarioPropiedadPOST = async (req, res) => {
  try {
    const { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie } = req.body;
    const cedula_propietario = req.session.data_propietario.cedula;
    const userId = req.user.id;
    const files = req.files;

    const isImagenValida = (filePath) => {
      try {
        const dimensions = gm.subClass({ imageMagick: true })(filePath).identifySync();
        return dimensions.width && dimensions.height;
      } catch (error) {
        return false;
      }
    };

    // Verifica si se han proporcionado archivos
    if (!files || files.length === 0) {
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

      return res.render("partials/dashboard/crear-propietario-propiedad", {
        Titulo: "Ibiza Prop | Crear propiedad",
        N_inicios,
        rutaIF: "Backend",
        Correos,
        N_correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "No ha seleccionado ninguna imagen para la propiedad" }
      });
    }

    const processImage = async (file) => {
      const imagePath = path.join(__dirname, `public/images/uploads/propiedades/original/${file.filename}`);
      const outputDirectory = path.join(__dirname, 'public/images/uploads/propiedades/');

      try {
        // Redimensionar la imagen a diferentes tamaños
        await gm(imagePath)
          .resize(800, 600)
          .write(path.join(outputDirectory, 'large', file.filename), (err) => {
            if (err) throw err;
          });

        await gm(imagePath)
          .resize(400, 300)
          .write(path.join(outputDirectory, 'medium', file.filename), (err) => {
            if (err) throw err;
          });

        await gm(imagePath)
          .resize(200, 150)
          .write(path.join(outputDirectory, 'small', file.filename), (err) => {
            if (err) throw err;
          });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    };

    // Procesar y guardar imágenes en diferentes tamaños
    for (const file of files) {
      const imageProcessed = await processImage(file);

      if (!imageProcessed) {
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

        return res.render("partials/dashboard/crear-propietario-propiedad", {
          Titulo: "Ibiza Prop | Crear propiedad",
          N_inicios,
          ruta: "/usuarios",
          rutaIF: "Backend",
          Inicios_de_sesiones: Inicios_de_sesiones,
          Correos,
          N_correos,
          datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "Por favor, selecciona archivos de imagen válidos." }
        });
      }
    }

    // Guardar la información principal en la base de datos
    const propiedad = await db.propiedades.create({
      data: {
        usuarioId: userId,
        id_propietario: cedula_propietario,
        tipo_propiedad,
        venta_renta,
        descripcion,
        detalles,
        ubicacion,
        estado: estado,
        usuarioId: userId,
        precio: parseFloat(precio) || 0,
        n_habitaciones: parseFloat(n_habitaciones) || 0,
        n_banos: parseFloat(n_banos) || 0,
        terreno: parseFloat(terreno) || 0,
        superficie: parseFloat(superficie) || 0,
      },
    });

    const img_propiedad = await db.propiedades_img.create({
      data: {
        id_propiedad: propiedad.id,
        rutas: req.files.map(file => file.filename),
      },
    });

    req.flash('propiedadC', "propietario creado satisfactoriamente");

    // Elimina la propiedad específica de la sesión
    delete req.session.data_propietario;

    return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");

  } catch (error) {
    // Manejo de errores y redirección en caso de problemas
    await db.log_sistema.create({
      data: {
        controlador: "crearPropietarioPropiedadPOST",
        error: error.toString()
      },
    });

    req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

    return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");
  }
};

/* export const crearPropiedadPOST = async (req, res) => {
  try {

      const { id ,tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie } = req.body;
      
      const userId = req.user.id;
      
      const files = req.files;

      const isImagenValida = (filePath) => {

        try {

          const dimensions = sizeOf(filePath);
          return dimensions.width && dimensions.height;

        } catch (error) {

          return false;

        }
      };


  
      // Verifica si se han proporcionado archivos
      if (!files || files.length === 0) {
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
  
        return res.render("partials/dashboard/anadir_propiedad", {
          Titulo: "Ibiza Prop | Añadir propiedad",
          N_inicios,
          rutaIF: "Backend",
          Correos,
          N_correos,
          Inicios_de_sesiones: Inicios_de_sesiones,
          datos_formulario: { id, tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "No ha seleccionado ninguna imagen para la propiedad" }
        });
      }
  
      const processImage = async (file) => {
        const imagePath = path.join(__dirname, `public/images/uploads/propiedades/original/${file.filename}`);
      
        if (isImagenValida(imagePath)) {

          const dimensions = sizeOf(imagePath);
          const imagenGrande = path.join(__dirname, `public/images/uploads/propiedades/large/${file.filename}`);
          const imagenMediana = path.join(__dirname, `public/images/uploads/propiedades/medium/${file.filename}`);
          const imagenPequena = path.join(__dirname, `public/images/uploads/propiedades/small/${file.filename}`);
      
          try {
            // Desactiva el caché para cerrar el recurso después de su uso
            sharp.cache(false);
      
            await sharp(file.path).resize(800, 600).toFile(imagenGrande);
            await sharp(file.path).resize(400, 300).toFile(imagenMediana);
            await sharp(file.path).resize(200, 150).toFile(imagenPequena);

          } catch (sharpError) {
            return false;
          } finally {
            // Reactiva el caché después de su uso
            sharp.cache(true);
          }
      
          return true;

        } else {
          return false;
        }
      };
  
      // Procesar y guardar imágenes en diferentes tamaños
      for (const file of files) {

        const imageProcessed = await processImage(file);
  
        if (!imageProcessed) {

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
  
          return res.render("partials/dashboard/anadir_propiedad", {
            Titulo: "Ibiza Prop | Añadir propiedad",
            N_inicios,
            ruta: "/usuarios",
            rutaIF: "Backend",
            Inicios_de_sesiones: Inicios_de_sesiones,
            Correos,
            N_correos,
            datos_formulario: { id, tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "Por favor, selecciona archivos de imagen válidos." }
          });
        }
      }
  
      // Guardar la información principal en la base de datos
      const propiedad = await db.propiedades.create({
        data: {
          usuarioId: userId,
          id_propietario: parseInt(id),
          tipo_propiedad,
          venta_renta,
          descripcion,
          detalles,
          ubicacion,
          estado: estado,
          usuarioId: userId,
          precio: parseFloat(precio) || 0,
          n_habitaciones: parseFloat(n_habitaciones) || 0,
          n_banos: parseFloat(n_banos) || 0,
          terreno: parseFloat(terreno) || 0,
          superficie: parseFloat(superficie) || 0,
        },
      });
  
      const img_propiedad = await db.propiedades_img.create({
        data: {
          id_propiedad: propiedad.id,
          rutas: req.files.map(file => file.filename),
        },
      });
  
      req.flash('propiedadC', "propietario creado satisfactoriamente");

      // Elimina la propiedad específica de la sesión
      delete req.session.data_propietario;
  
      return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");


    } catch (error) {

      console.log(error)

      // Manejo de errores y redirección en caso de problemas
      await db.log_sistema.create({
        data: {
            controlador: "crearPropietarioPropiedadPOST",
            error: error.toString()
        },
      });

      req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

      return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");   
    }
   
}; */

export const crearPropiedadPOST = async (req, res) => {
  try {
    const { id, tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie } = req.body;
    const userId = req.user.id;
    const files = req.files;

    const isImagenValida = (filePath) => {
      try {
        const dimensions = sizeOf(filePath);
        return dimensions.width && dimensions.height;
      } catch (error) {
        return false;
      }
    };

    // Verifica si se han proporcionado archivos
    if (!files || files.length === 0) {
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

      return res.render("partials/dashboard/anadir_propiedad", {
        Titulo: "Ibiza Prop | Añadir propiedad",
        N_inicios,
        rutaIF: "Backend",
        Correos,
        N_correos,
        Inicios_de_sesiones: Inicios_de_sesiones,
        datos_formulario: { id, tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "No ha seleccionado ninguna imagen para la propiedad" }
      });
    }

    const processImage = async (file) => {
      const imagePath = path.join(__dirname, `public/images/uploads/propiedades/original/${file.filename}`);

      if (isImagenValida(imagePath)) {

        const dimensions = sizeOf(imagePath);
        const imagenGrande = path.join(__dirname, `public/images/uploads/propiedades/large/${file.filename}`);
        const imagenMediana = path.join(__dirname, `public/images/uploads/propiedades/medium/${file.filename}`);
        const imagenPequena = path.join(__dirname, `public/images/uploads/propiedades/small/${file.filename}`);

        try {
          await new Promise((resolve, reject) => {
            gm(file.path)
              .resize(800, 600)
              .write(imagenGrande, (err) => {
                if (err) reject(err);
                resolve();
              });
          });

          await new Promise((resolve, reject) => {
            gm(file.path)
              .resize(400, 300)
              .write(imagenMediana, (err) => {
                if (err) reject(err);
                resolve();
              });
          });

          await new Promise((resolve, reject) => {
            gm(file.path)
              .resize(200, 150)
              .write(imagenPequena, (err) => {
                if (err) reject(err);
                resolve();
              });
          });

        } catch (gmError) {
          return false;
        }

        return true;

      } else {
        return false;
      }
    };

    // Procesar y guardar imágenes en diferentes tamaños
    for (const file of files) {

      const imageProcessed = await processImage(file);

      if (!imageProcessed) {
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

        return res.render("partials/dashboard/anadir_propiedad", {
          Titulo: "Ibiza Prop | Añadir propiedad",
          N_inicios,
          ruta: "/usuarios",
          rutaIF: "Backend",
          Inicios_de_sesiones: Inicios_de_sesiones,
          Correos,
          N_correos,
          datos_formulario: { id, tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "Por favor, selecciona archivos de imagen válidos." }
        });
      }
    }

    // Guardar la información principal en la base de datos
    const propiedad = await db.propiedades.create({
      data: {
        usuarioId: userId,
        id_propietario: parseInt(id),
        tipo_propiedad,
        venta_renta,
        descripcion,
        detalles,
        ubicacion,
        estado: estado,
        usuarioId: userId,
        precio: parseFloat(precio) || 0,
        n_habitaciones: parseFloat(n_habitaciones) || 0,
        n_banos: parseFloat(n_banos) || 0,
        terreno: parseFloat(terreno) || 0,
        superficie: parseFloat(superficie) || 0,
      },
    });

    const img_propiedad = await db.propiedades_img.create({
      data: {
        id_propiedad: propiedad.id,
        rutas: req.files.map(file => file.filename),
      },
    });

    req.flash('propiedadC', "propietario creado satisfactoriamente");

    // Elimina la propiedad específica de la sesión
    delete req.session.data_propietario;

    return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");

  } catch (error) {
    console.log(error);

    // Manejo de errores y redirección en caso de problemas
    await db.log_sistema.create({
      data: {
        controlador: "crearPropietarioPropiedadPOST",
        error: error.toString()
      },
    });

    req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o comuníquese con su desarrollador');

    return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");
  }
};

export const eliminarPropietarioDELETE = async (req, res) => {

  try {
    
    const idPropietario = parseInt(req.params.id);

    // Obtén el propietario con todas las relaciones
    const propietario = await db.propietarios.findUnique({
      where: {
        cedula: Number(idPropietario),
      },
      include: {
        casas: {
          include: {
            fotos: true,
          },
        },
      },
    });
  
    if (!propietario) {
      return res.redirect("/admin-ibizapropiedades-dashboard/propietarios")
    }
  
    // Define las carpetas de imágenes
    const carpetasImagenes = [
      '/images/uploads/propiedades/large/',
      '/images/uploads/propiedades/medium/',
      '/images/uploads/propiedades/original/',
      '/images/uploads/propiedades/small/',
    ];
  
    // Elimina todas las propiedades asociadas al propietario
    for (const propiedad of propietario.casas) {
      // Elimina las imágenes asociadas a la propiedad
      for (const imagen of propiedad.fotos) {
        for (const carpetaImagenes of carpetasImagenes) {
          if (Array.isArray(imagen.rutas)) {
            // Si las rutas son un array, úsalo directamente
            for (const ruta of imagen.rutas) {
              const rutaCompleta = path.join(__dirname, 'public', carpetaImagenes, ruta);
              try {

                await fs.unlink(rutaCompleta);

              } catch (error) {
                return false
              }
            }
          } else {
            // Si no es un array, asume que es una cadena y divídela por comas
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
  
      // Elimina la propiedad
      await db.propiedades_img.deleteMany({
        where: {
          id_propiedad: propiedad.id,
        },
      });
  
      // Elimina la propiedad
      await db.propiedades.delete({
        where: {
          id: propiedad.id,
        },
      });
    }
  
    // Elimina al propietario
    await db.propietarios.delete({
      where: {
        cedula: Number(idPropietario),
      },
    });

    req.flash("propietario_eliminado", "Propietario eliminado correctamente.")
  
    return res.redirect("/admin-ibizapropiedades-dashboard/propietarios");

  } catch (error) {
    // Manejo de errores y redirección en caso de problemas
    await db.log_sistema.create({
      data: {
          controlador: "eliminarPropietarioDELETE",
          error: error.toString()
      },
    });

    req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

    return res.redirect("/admin-ibizapropiedades-dashboard/propietarios");
  }
     
};

export const actualizarPropietarioGET = async (req, res) => {

  try {

       // Obtener el ID del propietario de los parámetros de la solicitud
       const propietarioId = parseInt(req.params.id);

       // Buscar el propietario por su ID en la base de datos
       const propietarioExistente = await db.propietarios.findUnique({
         where: {
           cedula: propietarioId,
         },
       });
   
       // Verificar si el propietario existe en la base de datos
       if (!propietarioExistente) {
         // Redirigir a otra vista si el propietario no existe
         return res.redirect('/admin-ibizapropiedades-dashboard/propietarios');
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
      
   
       // Renderizar la vista con los datos del propietario actualizado
      return res.render("partials/dashboard/propietario_actualizar", {
          Titulo: "Ibiza Prop | Actualizar propietario",
          N_inicios,
          rutaIF: "Backend",
          Correos,
          N_correos,
          Inicios_de_sesiones: Inicios_de_sesiones,
          propietarioExistente
      })

  } catch (error) {
    console.error('Error al actualizar propietario:', error);
    res.status(500).json({ error: 'Detectamos un error no validado en las respuestas HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.' });
  }

};

export const actualizarPropietarioPUT = async (req, res) => {

  
    try {

      const { cedula, nombres, apellidos, telefono, correo } = req.body;
  
      // Verificar si el propietario existe
      const propietarioExistente = await db.propietarios.findUnique({
        where: {
          cedula: parseInt(cedula),
        },
      });
  
      if (!propietarioExistente) {
        return res.status(404).json({ mensaje: 'Propietario no encontrado' });
      }
  
      // Actualizar los datos del propietario
      const propietarioActualizado = await db.propietarios.update({
        where: {
          cedula: parseInt(cedula),
        },
        data: {
          nombres,
          apellidos,
          telefono,
          correo,
        },
      });

      req.flash("usuario_update", "Usuario actualizado correctamente.")
  
      return res.redirect("/admin-ibizapropiedades-dashboard/propietarios")
      

    } catch (error) {
      console.error('Error al actualizar propietario:', error);
      res.status(500).json({ error: 'Detectamos un error no validado en las respuestas HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.' });
    }
 
};

export const anadirPropiedadGET = async (req, res) => {

  try {

        // Obtener el parámetro de la cédula y convertirlo a número
        const cedula = req.params.id;
        const cedulaNumero = parseInt(cedula);
    
        // Verificar si la conversión fue exitosa y si es un número
        if (isNaN(cedulaNumero)) {
          return res.status(400).json({ mensaje: 'El parámetro de cédula no es un número válido' });
        }
    
        // Verificar si la cédula ya existe en la base de datos
        const propietarioExistente = await db.propietarios.findUnique({
          where: {
            cedula: cedulaNumero,
          },
        });
    
        if (!propietarioExistente) {
          // Redirigir a otra vista si el propietario no existe
          return res.redirect('/otra-vista');
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
  
   return res.render("partials/dashboard/anadir_propiedad", {
     Titulo: "Ibiza Prop | Añadie propiedad",
     N_inicios,
     rutaIF: "Backend",
     Correos,
     N_correos,
     Inicios_de_sesiones: Inicios_de_sesiones,
     propiedadExistente: propietarioExistente
   })
    
  } catch (error) {
        // Manejo de errores y redirección en caso de problemas
        await db.log_sistema.create({
          data: {
              controlador: "crearPropietarioPropiedadGET",
              error: error.toString()
          },
        });

        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');

        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");   
  }

};
