import { Router } from "express";
const router = Router();

import { validate_crear_usuaurio } from "../middlewares/validacion_crear_usuario.middleware.js";
import { obtenerUsuariosGET, CrearUsuarioGET, CrearUsuarioPOST, eliminarUsuarioPOST} from "../controllers/usuarios.controller.js";

router.get("/usuarios", obtenerUsuariosGET)

router.get("/crear-usuario", CrearUsuarioGET);

router.post("/crear-usuario", validate_crear_usuaurio, CrearUsuarioPOST)

router.post("/eliminar-usuario/:id", eliminarUsuarioPOST);


export default router;
