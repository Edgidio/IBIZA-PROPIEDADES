import { Router } from 'express';
const router = Router();

// Controllers
import { actualizarPropiedadesPUT, crearPropiedadPOTS, eliminarPropiedadDELETE, obtenerPropiedadGET, obtenerPropiedadesDePropietario, obtenerPropiedadesGET } from '../controllers/propiedades.controller.js';

router.get('/propiedad/:id', obtenerPropiedadGET);

router.get('/propiedades-propietario/:id_propietario', obtenerPropiedadesDePropietario);  

router.get('/propiedades', obtenerPropiedadesGET);

router.post('/propiedad-crear', crearPropiedadPOTS);

router.delete('/propiedad/:id', eliminarPropiedadDELETE);

router.put('/propiedad/:id', actualizarPropiedadesPUT);

export default router;