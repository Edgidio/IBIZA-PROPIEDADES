import { Router } from 'express';
const router = Router();

import { correo_GET, correoDELETE, propiedadCorreosDELETE, propiedadCorreosGET, sistemaGET, sistemaInformacionGET, valora_su_propiedad_DELETE, valora_su_propiedad_GET,} from '../controllers/correos_sistema.controller.js';

router.get("/correos", correo_GET);
router.post("/correos/:id", correoDELETE);

router.get("/valora-su-propiedad", valora_su_propiedad_GET);
router.post("/valora-su-propiedad/:id", valora_su_propiedad_DELETE);

router.get("/inicios-de-sesion", sistemaGET);
router.get("/inicios-de-sesion/informacion/:id", sistemaInformacionGET);

router.get("/propiedad-correos", propiedadCorreosGET);
router.post("/propiedad-correos/:id", propiedadCorreosDELETE);

export default router;