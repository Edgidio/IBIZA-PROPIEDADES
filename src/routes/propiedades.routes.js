import { Router } from 'express';
const router = Router();

// Controllers
import { actualizarPropiedadesGET, actualizarPropiedadesPUT, crearPropiedadPOTS, eliminarPropiedadDELETE, 
obtenerPropiedadGET, obtenerPropiedadesApartamentoGET, obtenerPropiedadesCasasGET, obtenerPropiedadesDePropietario, obtenerPropiedadesEdificiosGET, obtenerPropiedadesGET, obtenerPropiedadesLocalComercialGET, obtenerPropiedadesOficinasGET, obtenerPropiedadesTerrenosGET } from '../controllers/propiedades.controller.js';
import { validacion_actualizar_propiedad_propietario } from '../middlewares/validacion_actualizar_propiedad.middleware.js';
/* router.get('/propiedad/:id', obtenerPropiedadGET); */

router.get('/propiedades-propietario/:id_propietario', obtenerPropiedadesDePropietario);  

router.get('/propiedades', obtenerPropiedadesGET);

router.get('/propiedad/:id', obtenerPropiedadGET);

router.post('/propiedad-crear', crearPropiedadPOTS);

router.post('/propiedad/:id', eliminarPropiedadDELETE);

router.get('/propiedad/actualizar/:id', actualizarPropiedadesGET);

router.post('/propiedades/actualizar/:id', validacion_actualizar_propiedad_propietario , actualizarPropiedadesPUT);

router.get('/propiedades/casas', obtenerPropiedadesCasasGET);

router.get('/propiedades/apartamentos', obtenerPropiedadesApartamentoGET);

router.get('/propiedades/terrenos', obtenerPropiedadesTerrenosGET);

router.get('/propiedades/local-comercial', obtenerPropiedadesLocalComercialGET);

router.get('/propiedades/oficinas', obtenerPropiedadesOficinasGET);

router.get('/propiedades/edificios', obtenerPropiedadesEdificiosGET);

export default router;