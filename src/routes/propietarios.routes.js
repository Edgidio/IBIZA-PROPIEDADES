import { Router } from "express";
const router = Router();

import {__dirname} from '../app.js'

// Importa la instancia de Multer
import path from 'path';
import fs from 'fs-extra';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Importa la función v4 de uuid
// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'public/images/uploads/propiedades/original');
      fs.ensureDirSync(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

// Middlewares
import { validate_crear_propietario } from "../middlewares/validacion_crear_propietario.middleware.js";
import { validacion_crear_propiedad_propietario } from "../middlewares/validacion_crear_propiedad_propietario.middleware.js";

// Controllers
import { actualizarPropietarioPUT, crearPropietarioGET, crearPropietarioPOST, crearPropietarioPropiedadGET, crearPropietarioPropiedadPOST, eliminarPropietarioDELETE, obtenerPropietariosGET } from "../controllers/propietarios.controller.js";


router.get("/propietarios", obtenerPropietariosGET)

router.get("/propietario-crear", crearPropietarioGET)

router.post('/propietario-crear', validate_crear_propietario , crearPropietarioPOST);

router.get("/propietario-crear/propiedad", crearPropietarioPropiedadGET)

router.post("/propietario-crear/propiedad", upload.array('fotos', 12), /* validacion_crear_propiedad_propietario, */ crearPropietarioPropiedadPOST)

router.delete('/propietario-eliminar/:id', eliminarPropietarioDELETE);

router.put('/propietario-actualizar/:id', actualizarPropietarioPUT);

export default router;