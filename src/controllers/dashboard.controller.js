import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

export const dashboardGET = async (req, res) => {
    try {

      // Obtener el total de precios de propiedades
        const totalPrecio = await db.propiedades.aggregate({
            _sum: {
            precio: true,
            },
        });
        
        // Obtener el total de propiedades
        const totalPropiedades = await db.propiedades.count();
        
        const totalPropietarios = await db.propietarios.count();

        const totalCasasVendidas = await db.propiedades.count({
            where: {
              vendida: true,
            },
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
    
    return res.render('partials/dashboard/index', {
        Titulo: "Ibiza Prop | Dashboard",
        Inicios_de_sesiones: Inicios_de_sesiones,
        N_inicios,
        rutaIF: "Backend",
        N_correos,
        Correos,
        error_controlador: req.flash('error_controlador'),
        totalCasasVendidas,
        totalPropietarios,
        totalPropiedades,
        totalPrecio:totalPrecio._sum.precio

    });
      
    }catch (error) {
        
        // Manejo de errores y redirección en caso de problemas
        await db.log_sistema.create({
            data: {
                controlador: "dashboardGET",
                error: error.toString()
            },
        });

        console.log(error)
  
        req.flash('error_controlador', 'Hubo un problema interno en el servidor');

        return res.redirect("/admin-ibizapropiedades-dashboard");

    }
};