import { Router } from 'express';
const router = Router();

import { correo_GET, correoDELETE, sistemaGET, sistemaInformacionGET, valora_su_propiedad_GET, valora_su_propiedad_POST } from '../controllers/correos_sistema.controller.js';

router.get("/correos", correo_GET);
router.post("/correos/:id", correoDELETE);

router.get("/valora-su-propiedad", valora_su_propiedad_GET);
router.post("/valora-su-propiedad", valora_su_propiedad_POST);

router.get("/inicios-de-sesion", sistemaGET);
router.get("/inicios-de-sesion/informacion/:id", sistemaInformacionGET);

export default router;