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
  
export const upload = multer({ storage: storage });

// Middlewares
import { validate_crear_propietario } from "../middlewares/validacion_crear_propietario.middleware.js";
import { validacion_crear_propiedad_propietario } from "../middlewares/validacion_crear_propiedad_propietario.middleware.js";

// Controllers
import { actualizarPropietarioGET, actualizarPropietarioPUT, anadirPropiedadGET, crearPropiedadPOST, crearPropietarioGET, crearPropietarioPOST, crearPropietarioPropiedadGET, crearPropietarioPropiedadPOST, eliminarPropietarioDELETE, obtenerPropietariosGET } from "../controllers/propietarios.controller.js";
import { validate_actualizar_propietario } from "../middlewares/validacion_actualizar_propietario.middleare.js";
import { validacion_actualizar_propiedad_propietario } from "../middlewares/validacion_actualizar_propiedad.middleware.js";
import { validacion_add_propiedad } from "../middlewares/validacion_add_propiedad.middleware.js";


router.get("/propietarios", obtenerPropietariosGET)

router.get("/propietario-crear", crearPropietarioGET)

router.post('/propietario-crear', validate_crear_propietario , crearPropietarioPOST);

router.get("/propietario-crear/propiedad", crearPropietarioPropiedadGET)

router.post("/propietario-crear/propiedad", upload.array('fotos', 12), validacion_crear_propiedad_propietario, crearPropietarioPropiedadPOST)
router.post("/propietario-add/", upload.array('fotos', 12), validacion_add_propiedad, crearPropiedadPOST)

router.post('/propietario-eliminar/:id', eliminarPropietarioDELETE);

router.get('/propietario-actualizar/:id', actualizarPropietarioGET);

router.post('/propietario-actualizar/',validate_actualizar_propietario,actualizarPropietarioPUT);

router.get('/propietario-add/:id', anadirPropiedadGET);

export default router;