import { Router } from "express";
const router = Router();

// Middlewares
import { validate_crear_propietario } from "../middlewares/validacion_crear_propietario.middleware.js";

// Controllers
import { actualizarPropietarioPUT, crearPropietarioGET, crearPropietarioPOST, crearPropietarioPropiedadGET, crearPropietarioPropiedadPOST, eliminarPropietarioDELETE, obtenerPropietariosGET } from "../controllers/propietarios.controller.js";


router.get("/propietarios", obtenerPropietariosGET)

router.get("/propietario-crear", crearPropietarioGET)

router.post('/propietario-crear', validate_crear_propietario , crearPropietarioPOST);

router.get("/propietario-crear/propiedad", crearPropietarioPropiedadGET)

router.post("/propietario-crear/propiedad", crearPropietarioPropiedadPOST)

router.delete('/propietario-eliminar/:id', eliminarPropietarioDELETE);


router.put('/propietario-actualizar/:id', actualizarPropietarioPUT);

export default router;