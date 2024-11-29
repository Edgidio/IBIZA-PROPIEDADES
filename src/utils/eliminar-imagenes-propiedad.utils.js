import path from 'path';
import fs from 'fs-extra';
import {__dirname} from '../app.js'

export const eliminarImagenes = async (imagenes) => {
  // Define las carpetas de imágenes directamente en la función
  const carpetasImagenes = [
    '/images/uploads/propiedades/large/',
    '/images/uploads/propiedades/medium/',
    '/images/uploads/propiedades/original/',
    '/images/uploads/propiedades/small/',
  ];

  for (const imagen of imagenes) {
    for (const carpeta of carpetasImagenes) {
      const rutas = Array.isArray(imagen.rutas) ? imagen.rutas : imagen.rutas.split(',');
      for (const ruta of rutas) {
        const rutaCompleta = path.join(__dirname, 'public', carpeta, ruta);
        try {
          await fs.unlink(rutaCompleta);
        } catch (error) {
          console.error(`Error eliminando la imagen ${rutaCompleta}:`, error);
          return false;
        }
      }
    }
  }
  return true;
};

