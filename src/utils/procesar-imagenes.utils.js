import path from 'path';
import sizeOf from 'image-size';
import gm from 'gm';

import {__dirname} from '../app.js'

export const isImagenValida = (filePath) => {
  try {
    const dimensions = sizeOf(filePath);
    return dimensions.width && dimensions.height;
  } catch (error) {
    console.log(error)
    return false;
  }
};

export const procesarImagen = async (file, outputPath) => {
  const imagePath = path.join(__dirname, `public/images/uploads/propiedades/original/${file.filename}`);

  if (!isImagenValida(imagePath)) {
    return false;
  }

  const imagenes = {
    grande: path.join(outputPath, 'large', file.filename),
    mediana: path.join(outputPath, 'medium', file.filename),
    pequena: path.join(outputPath, 'small', file.filename),
  };

  try {
    // Redimensionar imágenes en diferentes tamaños
    await new Promise((resolve, reject) => {
      gm(file.path)
        .resize(800, 600)
        .write(imagenes.grande, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      gm(file.path)
        .resize(400, 300)
        .write(imagenes.mediana, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      gm(file.path)
        .resize(200, 150)
        .write(imagenes.pequena, (err) => (err ? reject(err) : resolve()));
    });

    return true;
  } catch (error) {
    console.error(`Error al procesar imagen: ${error}`);
    return false;
  }
};

