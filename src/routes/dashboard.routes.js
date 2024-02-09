import { Router } from 'express';
const router = Router();

import { busqueda_usuariosGET, dashboardGET } from '../controllers/dashboard.controller.js';

router.get("/", dashboardGET);
router.post("/busqueda", busqueda_usuariosGET);



export default router;