// Variables globales
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Importaciones de paquetes NODE
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

export const lenguaje = async (req, nombreIdioma) => {

       // Obtener el encabezado 'Accept-Language'
   const acceptLanguage = req.headers['accept-language'];

   // Extraer el idioma principal
   const preferredLanguage = acceptLanguage ? acceptLanguage.split(',')[0].split('-')[0] : 'en';


    // Cargar el archivo JSON
    const translationPath = path.join(__dirname, "../", 'public', 'languages', "frontend", preferredLanguage, nombreIdioma);

   // Ruta al archivo JSON
    const filePath = path.resolve(`${translationPath}`);

    // Leer el archivo JSON
    const t = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    return t

};