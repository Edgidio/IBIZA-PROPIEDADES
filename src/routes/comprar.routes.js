import { Router } from 'express';

const router = Router();

//midelewares


// controller
import { casa, apartamento, terreno, edificio, local_comercial, oficina, penthouses, townhouses, galpones } from '../controllers/comprar.controller.js';


router.get("/casa", casa);
router.get("/apartamento", apartamento);
router.get("/terreno", terreno);
router.get("/edificio", edificio);
router.get("/local-comercial", local_comercial);
router.get("/oficina", oficina);
router.get("/penthouses", penthouses);
router.get("/townhouses", townhouses);
router.get("/galpones", galpones);


export default router;