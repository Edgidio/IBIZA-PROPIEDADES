import {PrismaClient} from "@prisma/client"
import mimeTypes from 'mime-types';
import sharp from 'sharp'; // Asegúrate de haber instalado sharp
import {__dirname} from '../app.js'
import sizeOf from 'image-size';
// Importa la instancia de Multer
import path from 'path';
import fs from 'fs-extra';

import tmp from 'tmp';
import util from 'util';
import stream from 'stream';
import fkill from 'fkill';


const db = new PrismaClient();

export const obtenerPropietariosGET = async (req, res) => {
    try {

         /*  const propietarios = await db.propietarios.findMany();

          console.log(propietarios) */

          // Obtén todos los propietarios con sus propiedades
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

    console.log(propietariosConConteo)
    
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
            propietarios: propietariosConConteo,
            rutaIF: "Backend"
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
            rutaIF: "Backend",
            propiedadC :req.flash('propiedadC')
            
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
          nombre_creador: req.user.id.toString()
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
     req_nuevo_propietario: req.flash("nuevo_propietario"),
     rutaIF: "Backend"
   })
};

export const crearPropietarioPropiedadPOST = async (req, res) => {
    try {

/*         const userId = req.user.id;

        const cedula_propietario = req.session.data_propietario.cedula

        const { tipo_propiedad, venta_renta, descripcion, detalles, estado , ubicacion, precio, n_habitaciones, n_banos, terreno, superficie} = req.body;

        // Accede a la información de los archivos subidos desde req.files
        const files = req.files;

        // Verifica si se han proporcionado archivos
        if (!req.files || req.files.length === 0) {

          const N_inicios = await db.log_sesiones.count({
                where: {
                visto: false,
                },
            });
        
          return res.render("partials/dashboard/crear-propietario-propiedad", {
              Titulo: "Ibiza Prop | Crear propiedad",
              N_inicios,
              ruta: "/usuarios",
              rutaIF: "Backend",
              datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles,estado , ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "No ha seleccionado ninguna imagen para la propiedad"}
            })

          }
  

        // Verifica el tipo de cada archivo utilizando la biblioteca mime-types
        for (const imagen of files) {
          // Obtén el tipo de archivo
          const mimeType = mimeTypes.lookup(imagen.originalname);

          // Verifica si es una imagen
          if (!mimeType || !mimeType.startsWith('image/')) {
            const N_inicios = await db.log_sesiones.count({
              where: {
              visto: false,
              },
          });
      
        return res.render("partials/dashboard/crear-propietario-propiedad", {
              Titulo: "Ibiza Prop | Crear propiedad",
              N_inicios,
              ruta: "/usuarios",
              rutaIF: "Backend",
              datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles,estado , ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "Por favor, selecciona archivos de imagen válidos."}
            })
          }
        }

        // Crea carpetas si no existen
        const carpetas = ['original', 'large', 'medium', 'small'];

        // Función para verificar si el archivo es una imagen válida
        const isImagenValida = (filePath) => {
          try {
            const dimensions = sizeOf(filePath);
            return dimensions.width && dimensions.height;
          } catch (error) {
            // Si hay un error al intentar obtener las dimensiones, asumimos que no es una imagen válida
            return false;
          }
        };


        // Procesa y guarda imágenes en diferentes tamaños
        for (const file of files) {

          const imagePath = path.join(__dirname, `public/images/uploads/propiedades/original/${file.filename}`);

          // Verifica si el archivo es una imagen antes de intentar obtener las dimensiones
          if (isImagenValida(imagePath)) {
            const dimensions = sizeOf(imagePath);
            console.log('Dimensiones de la imagen:', dimensions);
            const imagenGrande = path.join(__dirname, `public/images/uploads/propiedades/large/${file.filename}`);
            const imagenMediana = path.join(__dirname, `public/images/uploads/propiedades/medium/${file.filename}`);
            const imagenPequena = path.join(__dirname, `public/images/uploads/propiedades/small/${file.filename}`);
  
            // Procesa y guarda en tamaño grande
            await sharp(file.path).resize(800, 600).toFile(imagenGrande);
  
            // Procesa y guarda en tamaño mediano
            await sharp(file.path).resize(400, 300).toFile(imagenMediana);
  
            // Procesa y guarda en tamaño pequeño
            await sharp(file.path).resize(200, 150).toFile(imagenPequena);
          } else {
            console.log('El archivo no es una imagen válida:', file.filename);
            // Puedes manejar archivos que no son imágenes aquí (por ejemplo, saltar la iteración)
            continue;
          }


        }

        // Guarda la información principal en la base de datos
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
            id_propiedad: propiedad.id, // Asigna el ID de la propiedad recién creada
            rutas: req.files.map(file => file.filename),
          },
        });

        req.flash('propiedadC', "propietario creado satisfatoriamente")

       
        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear") */
        const isImagenValida = (filePath) => {
          try {
            const dimensions = sizeOf(filePath);
            return dimensions.width && dimensions.height;
          } catch (error) {
            return false;
          }
        };

        const userId = req.user.id;
        const cedula_propietario = req.session.data_propietario.cedula;
        const { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie } = req.body;
        const files = req.files;
    
        // Verifica si se han proporcionado archivos
        if (!files || files.length === 0) {
          const N_inicios = await db.log_sesiones.count({
            where: {
              visto: false,
            },
          });
    
          return res.render("partials/dashboard/crear-propietario-propiedad", {
            Titulo: "Ibiza Prop | Crear propiedad",
            N_inicios,
            ruta: "/usuarios",
            rutaIF: "Backend",
            datos_formulario: { tipo_propiedad, venta_renta, descripcion, detalles, estado, ubicacion, precio, n_habitaciones, n_banos, terreno, superficie, foto: "No ha seleccionado ninguna imagen para la propiedad" }
          });
        }
    
        const processImage = async (file) => {
          const imagePath = path.join(__dirname, `public/images/uploads/propiedades/original/${file.filename}`);
        
          if (isImagenValida(imagePath)) {
            const dimensions = sizeOf(imagePath);
            console.log('Dimensiones de la imagen:', dimensions);
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
              console.error('Error al procesar la imagen:', sharpError);
              return false;
            } finally {
              // Reactiva el caché después de su uso
              sharp.cache(true);
            }
        
            return true;
          } else {
            console.log('El archivo no es una imagen válida:', file.filename);
            return false;
          }
        };
    
        // Procesar y guardar imágenes en diferentes tamaños
        for (const file of files) {
          const imageProcessed = await processImage(file);
    
          if (!imageProcessed) {
            const N_inicios = await db.log_sesiones.count({
              where: {
                visto: false,
              },
            });
    
            return res.render("partials/dashboard/crear-propietario-propiedad", {
              Titulo: "Ibiza Prop | Crear propiedad",
              N_inicios,
              ruta: "/usuarios",
              rutaIF: "Backend",
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
    
        return res.redirect("/admin-ibizapropiedades-dashboard/propietario-crear");


      } catch (error) {
        console.error('Error al eliminar propietario y sus propiedades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
      return res.status(404).json({ error: 'Propietario no encontrado' });
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
                console.log(`Intentando eliminar: ${rutaCompleta}`);
                await fs.unlink(rutaCompleta);
                console.log(`Eliminado correctamente: ${rutaCompleta}`);
              } catch (error) {
                console.error(`Error al eliminar ${rutaCompleta}:`, error);
              }
            }
          } else {
            // Si no es un array, asume que es una cadena y divídela por comas
            const rutas = imagen.rutas.split(',');
            for (const ruta of rutas) {
              const rutaCompleta = path.join(__dirname, 'public', carpetaImagenes, ruta);
              try {
                console.log(`Intentando eliminar: ${rutaCompleta}`);
                await fs.unlink(rutaCompleta);
                console.log(`Eliminado correctamente: ${rutaCompleta}`);
              } catch (error) {
                console.error(`Error al eliminar ${rutaCompleta}:`, error);
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
  
    return res.redirect("/admin-ibizapropiedades-dashboard/propietarios");

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