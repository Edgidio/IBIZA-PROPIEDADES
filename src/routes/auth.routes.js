import { Router } from 'express';
const router = Router();

//midelewares
import { validateLogin } from '../middlewares/validacion_login.middleware.js';
import { isAuthenticatedLogin } from '../middlewares/isAuthenticated.js';
import passport from '../config/passport.js';

// controller
import { cerrarSesionGET, loginGET } from '../controllers/auth.controller.js';


router.get("/login", isAuthenticatedLogin,  loginGET);

router.post('/login',validateLogin, isAuthenticatedLogin, passport.authenticate('local', { successRedirect: '/admin-ibizapropiedades-dashboard', failureRedirect: '/admin-ibizapropiedades/login',}));

router.get('/logout', cerrarSesionGET);

export default router;
