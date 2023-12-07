import { Router } from 'express';
const router = Router();

import { dashboardGET } from '../controllers/dashboard.controller.js';

router.get("/", dashboardGET);

export default router;