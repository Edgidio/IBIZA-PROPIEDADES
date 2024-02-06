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