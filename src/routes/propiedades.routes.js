import { Router } from 'express';
const router = Router();

// Controllers
import { actualizarPropiedadesGET, actualizarPropiedadesPUT, crearPropiedadPOTS, desmarcarExhibicionPOS, eliminarPropiedadDELETE,marcarExhibicionPOS, 
obtenerPropiedadGET, obtenerPropiedadesApartamentoGET, obtenerPropiedadesCasasGET, obtenerPropiedadesDePropietario, obtenerPropiedadesEdificiosGET, obtenerPropiedadesGET, obtenerPropiedadesGalponesGET, obtenerPropiedadesLocalComercialGET, obtenerPropiedadesOficinasGET, obtenerPropiedadesPenthousesGET, obtenerPropiedadesTerrenosGET,
obtenerPropiedadesTownhousesGET} from '../controllers/propiedades.controller.js';

import { validacion_actualizar_propiedad_propietario } from '../middlewares/validacion_actualizar_propiedad.middleware.js';

import { upload } from './propietarios.routes.js';


router.get('/propiedades-propietario/:id_propietario', obtenerPropiedadesDePropietario);  

router.get('/propiedades', obtenerPropiedadesGET);

router.get('/propiedad/:id', obtenerPropiedadGET);

router.post('/propiedad-crear', crearPropiedadPOTS);

router.post('/propiedad/:id', eliminarPropiedadDELETE);

router.get('/propiedad/actualizar/:id', actualizarPropiedadesGET);

router.post('/propiedades/actualizar/:id', upload.array('fotos', 12), validacion_actualizar_propiedad_propietario , actualizarPropiedadesPUT);

router.get('/propiedades/casas', obtenerPropiedadesCasasGET);

router.get('/propiedades/apartamentos', obtenerPropiedadesApartamentoGET);

router.get('/propiedades/terrenos', obtenerPropiedadesTerrenosGET);

router.get('/propiedades/local-comercial', obtenerPropiedadesLocalComercialGET);

router.get('/propiedades/oficinas', obtenerPropiedadesOficinasGET);

router.get('/propiedades/edificios', obtenerPropiedadesEdificiosGET);

router.get('/propiedades/townhouses', obtenerPropiedadesTownhousesGET);

router.get('/propiedades/penthouses', obtenerPropiedadesPenthousesGET);

router.get('/propiedades/galpones', obtenerPropiedadesGalponesGET);

// Ruta para marcar una propiedad como en exhibición
router.post('/marcar-en-exhibicion/:id', marcarExhibicionPOS);

// Ruta para desmarcar una propiedad de la exhibición
router.post('/desmarcar-en-exhibicion/:id', desmarcarExhibicionPOS);
    

export default router;