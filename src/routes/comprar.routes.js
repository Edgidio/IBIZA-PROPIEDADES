import { Router } from 'express';

const router = Router();

//midelewares


// controller
import { casa, apartamento, terreno, edificio, local_comercial, oficina } from '../controllers/comprar.controller.js';


router.get("/casa", casa);
router.get("/apartamento", apartamento);
router.get("/terreno", terreno);
router.get("/edificio", edificio);
router.get("/local-comercial", local_comercial);
router.get("/oficina", oficina);


export default router;