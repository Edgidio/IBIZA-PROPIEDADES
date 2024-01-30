import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

export const dashboardGET = async (req, res) => {
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

    
    res.render('partials/dashboard/index', {
        Titulo: "Ibiza Prop | Dashboard",
        Inicios_de_sesiones: Inicios_de_sesiones,
        N_inicios,
        rutaIF: "Backend",
        N_correos,
        Correos
    });
      
    }catch (error) {
        
        

    }
};