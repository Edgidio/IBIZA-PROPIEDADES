import { Router } from 'express';

const router = Router();

//midelewares


// controller
import { valore_su_propiedad_GET, busquedaPropiedades, contacto, contactoPOST, index, propiedad, sobre_Nosotros, valore_su_propiedad_POST, propiedadPOST } from '../controllers/frontend.controller.js';
import { validacion_contacto } from '../middlewares/validacion_contacto.middleware.js';
import { validacion_correo_propiedad } from '../middlewares/validacion_propiedad.middleware.js';
import { validacion_valora_su_propiedd } from '../middlewares/validacion_valora_su_propiedad.middleware.js';


router.get("/", index);
router.get("/propiedad/:id", propiedad);
router.post("/propiedad/:id",validacion_correo_propiedad, propiedadPOST);
router.get("/sobre-nosotros", sobre_Nosotros);
router.get("/contacto", contacto);
router.post("/contacto", validacion_contacto, contactoPOST);
router.post("/busqueda/propiedades", busquedaPropiedades);
router.get("/venda-su-propiedad", valore_su_propiedad_GET);
router.post("/venda-su-propiedad", validacion_valora_su_propiedd, valore_su_propiedad_POST);

export default router;