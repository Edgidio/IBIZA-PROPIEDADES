import { Router } from 'express';

const router = Router();

//midelewares


// controller
import { index } from '../controllers/frontend.controller.js';


router.get("/", index);


export default router;