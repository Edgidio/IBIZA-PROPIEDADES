import {PrismaClient} from "@prisma/client"
import { eliminarImagenes } from "./eliminar-imagenes-propiedad.utils.js";
const db = new PrismaClient();

import path from 'path';


import {__dirname} from '../app.js'
import { procesarImagen } from "./procesar-imagenes.utils.js";

export const actualizarPropiedadEnDB = async (propiedadId, datosActualizados, files) => {
  try {
    // Buscar la propiedad existente
    const propiedadExistente = await db.propiedades.findUnique({
      where: { id: propiedadId },
      include: {
        fotos: true
      }
    });

    if (!propiedadExistente) {
      throw new Error('Propiedad no encontrada');
    }

    if(files.length >= 1) {

      /* propiedadExistente.fotos[0].id */
      const resultado = await eliminarImagenes(propiedadExistente.fotos);

      if (!resultado) {
        return console.log("ERR");
      }

      const outputPath = path.join(__dirname, 'public/images/uploads/propiedades');

      for (const file of files) {
        const procesada = await procesarImagen(file, outputPath);
        if (!procesada) {
          console.log(error)
        }
      }
  
      const img_propiedad = await db.propiedades_img.update({
        where: {
          id: propiedadExistente.fotos[0].id,  // Aquí usas el id de la propiedad existente
        },
        data: {
          rutas: files.map(file => file.filename), // Actualiza las rutas con los nuevos archivos
        },
      });
      

    }

    // Actualizar la propiedad
    const propiedadActualizada = await db.propiedades.update({
      where: { id: propiedadId },
      data: datosActualizados,
    });


    

    return propiedadActualizada;
  } catch (error) {
    console.log(error, "errppp")
  }
};
