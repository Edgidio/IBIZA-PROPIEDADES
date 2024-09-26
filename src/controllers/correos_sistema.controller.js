import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

import axios from 'axios';

export const correo_GET = async (req, res) => {
    try {

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

            const Correos_ = await db.correos_ibiza.findMany({
                orderBy: {
                  createdAt: 'desc'
                }
              });
        
            
            return res.render('partials/dashboard/correos', {
                Titulo: "Ibiza Prop | Correos",
                Inicios_de_sesiones: Inicios_de_sesiones,
                N_inicios,
                rutaIF: "Backend",
                N_correos,
                Correos,
                Correos_,
                correo_delete: req.flash("correo_delete"),
                error_controlador:req.flash('error_controlador')
            });


      
    }catch (error) {
        
         // Manejo de errores y redirección en caso de problemas
         await db.log_sistema.create({
            data: {
                controlador: "correo_GET",
                error: error.toString()
            },
        });
  
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
  
        return res.redirect(`/admin-ibizapropiedades-dashboard/correos`)   

        
    }
};

export const valora_su_propiedad_GET = async (req, res) => {
    try {

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

            const Correos_ = await db.correos_ibiza.findMany({
                orderBy: {
                  createdAt: 'desc'
                }
              });

            const valoraciones_propiedades = await db.valorarPropiedades.findMany(
                {
                    orderBy: {
                        createdAt: 'desc', // Ordenar por fecha de creación en orden descendente
                    },
                }
            );
 
            return res.render('partials/dashboard/valora_su_propiedad', {
                Titulo: "Ibiza Prop | Valorar propiedad",
                Inicios_de_sesiones: Inicios_de_sesiones,
                N_inicios,
                rutaIF: "Backend",
                N_correos,
                Correos,
                Correos_,
                correo_delete: req.flash("correo_delete"),
                error_controlador:req.flash('error_controlador'),
                valoraciones_propiedades
            });


      
    }catch (error) {
        
         // Manejo de errores y redirección en caso de problemas
         await db.log_sistema.create({
            data: {
                controlador: "valora_su_propiedad_GET",
                error: error.toString()
            },
        });
  
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
  
        return res.redirect(`/admin-ibizapropiedades-dashboard/`)   

        
    }
};

export const valora_su_propiedad_POST = async (req, res) => {
    try {

        console.log(req.body)
      
    }catch (error) {
        
         // Manejo de errores y redirección en caso de problemas
         await db.log_sistema.create({
            data: {
                controlador: "valora_su_propiedad_POST",
                error: error.toString()
            },
        });
  
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
  
        return res.redirect(`/admin-ibizapropiedades-dashboard/`)   

        
    }
};

export const correoDELETE = async (req, res) => {
    try {

        const id_correo = parseInt(req.params.id)

        const resultado = await db.correos_ibiza.delete({
            where: {
            id: id_correo,
            },
        });

        req.flash("correo_delete", `Correo con ID ${id_correo} eliminado correctamente.`)

        return res.redirect("/admin-ibizapropiedades-dashboard/correos")
      
    }catch (error) {
        
            // Manejo de errores y redirección en caso de problemas
            await db.log_sistema.create({
            data: {
                controlador: "correoDELETE",
                error: error.toString()
            },
        });
    
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
        return res.redirect(`/admin-ibizapropiedades-dashboard/correos`)   

    }
};

export const sistemaGET = async (req, res) => {
    try {

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

            const sesiones = await db.log_sesiones.findMany({
                orderBy: {
                  createdAt: 'desc'
                }
            });
        
            
            return res.render('partials/dashboard/inicios_de_sesion', {
                Titulo: "Ibiza Prop | Inicios de sesion",
                Inicios_de_sesiones: Inicios_de_sesiones,
                N_inicios,
                rutaIF: "Backend",
                N_correos,
                Correos,
                sesiones,
                error_controlador:req.flash('error_controlador')
            });


      
    }catch (error) {
        
                 // Manejo de errores y redirección en caso de problemas
                 await db.log_sistema.create({
                    data: {
                        controlador: "sistemaGET",
                        error: error.toString()
                    },
                });
          
                req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
          
                return res.redirect(`/admin-ibizapropiedades-dashboard/inicios-de-sesion`)   

    }
};

export const sistemaInformacionGET = async (req, res) => {
    try {

        const sesionId = parseInt(req.params.id)

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

        const sesiones = await db.log_sesiones.findUnique({
            where: {
              id: sesionId,
            },
        });

        const respuesta = await axios.get(`https://ipinfo.io/${sesiones.direccion_IP}/json`);
        
        const datosUbicacion = respuesta.data;

        console.log(datosUbicacion)
  
        
        return res.render('partials/dashboard/inicio_de_sesion', {
            Titulo: "Ibiza Prop | Inicios de sesion",
            Inicios_de_sesiones: Inicios_de_sesiones,
            N_inicios,
            rutaIF: "Backend",
            N_correos,
            Correos,
            sesiones,
            datosUbicacion
        });


      
    }catch (error) {
        
            // Manejo de errores y redirección en caso de problemas
            await db.log_sistema.create({
            data: {
                controlador: "sistemaInformacionGET",
                error: error.toString()
            },
        });
    
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
    
        return res.redirect(`/admin-ibizapropiedades-dashboard/inicios-de-sesion`)   
        

    }
};

export const propiedadCorreosGET = async (req, res) => {
    try {

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

        // Obtener todos los correos de la tabla correos_propiedad
        const correos_propiedad = await db.correos_propiedad.findMany({
            orderBy: {
                createdAt: 'desc', // 'desc' para obtener primero los correos más recientes
              },
        });  
        
        return res.render('partials/dashboard/correos_propiedad', {
            Titulo: "Ibiza Prop | Correos propiedad",
            Inicios_de_sesiones: Inicios_de_sesiones,
            N_inicios,
            rutaIF: "Backend",
            N_correos,
            correos_propiedad,
            correo_propiedad_eliminado: req.flash("correo_propiedad_eliminado")
        });


      
    }catch (error) {
        
            // Manejo de errores y redirección en caso de problemas
            await db.log_sistema.create({
            data: {
                controlador: "sistemaInformacionGET",
                error: error.toString()
            },
        });
    
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
      
        

    }
};

export const propiedadCorreosDELETE = async (req, res) => {
    try {

        const { id } = req.params;

        // Validación: verificar si el ID es un número
        if (isNaN(id)) {
          return res.redirect('/');  // Redirigir al inicio si el ID no es un número
        }
    
        // Eliminar el correo de la base de datos
        const correoEliminado = await db.correos_propiedad.delete({
        where: { id: parseInt(id) },  // Asegúrate de convertir el id a número
        });

        req.flash("correo_propiedad_eliminado", "Correo eliminado exitosamente")
    
        // Responder con éxito
        return res.redirect("/admin-ibizapropiedades-dashboard/propiedad-correos");


      
    }catch (error) {

        console.log(error)
        
            // Manejo de errores y redirección en caso de problemas
            await db.log_sistema.create({
            data: {
                controlador: "sistemaInformacionGET",
                error: error.toString()
            },
        });
    
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o cominiquese con su desarrollador');
      
        

    }
};


