import { Router } from 'express';

const router = Router();

//midelewares


// controller
import { busquedaPropiedades, contacto, contactoPOST, index, propiedad, sobre_Nosotros } from '../controllers/frontend.controller.js';
import { validacion_contacto } from '../middlewares/validacion_contacto.middleware.js';


router.get("/", index);
router.get("/propiedad/:id", propiedad);
router.get("/sobre-nosotros", sobre_Nosotros);
router.get("/contacto", contacto);
router.post("/contacto", validacion_contacto, contactoPOST);
router.post("/busqueda/propiedades", busquedaPropiedades);


export default router;