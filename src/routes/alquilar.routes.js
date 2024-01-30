import { Router } from 'express';

const router = Router();

//midelewares


// controller
import { casa, apartamento, terreno, local_comercial, oficina } from '../controllers/alquilar.controller.js';


router.get("/casa", casa);
router.get("/apartamento", apartamento);
router.get("/terreno", terreno);
router.get("/local-comercial", local_comercial);
router.get("/oficina", oficina);


export default router;