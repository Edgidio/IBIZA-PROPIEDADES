import express from "express"
const app = express()

// Variables globales
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Importaciones de paquetes NODE
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// FIN Importaciones de paquetes NODE

//Importaciones de paquetes NPM

import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();
import {engine} from 'express-handlebars';
import passport from 'passport';
import expressSession from 'express-session';
import requestIp from 'request-ip';
import cors from 'cors';
import helpers from './handlebars/if_helpers.js';
import flash from 'connect-flash';
// FIN Importaciones de paquetes NPM


// Configuraciones para express

app.engine('handlebars', engine({
  helpers: {
    eq: helpers.helpers.eq
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views' )); 

/* // Configuraciones para express
import configureSocket from './config/socket.io.js'; */

// Iniciar paquetes
const publicPath = path.join(path.join(__dirname, 'public'));
const server = http.createServer(app);
import {connect} from "./config/socket.io.js"
// FIN Iniciar paquetes

// middelewares
app.use(requestIp.mw())
app.use(
    expressSession({
      secret: 'PEVITE.COM-Secreto',
      resave: true,
      saveUninitialized: true,
    })
);
// Configuración de connect-flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));
app.use(cors());
connect(server)

// Importaciones de modulos personales
import {isAuthenticated} from './middlewares/isAuthenticated.js';
import usuarios_router from "./routes/usuarios.routes.js"
import propietarios_router from "./routes/propietarios.routes.js"
import propiedades_router from "./routes/propiedades.routes.js"
import dashboard_router from "./routes/dashboard.routes.js"
import auth_router from "./routes/auth.routes.js"


// Rutas de la aplicacion
app.use("/admin-ibizapropiedades", auth_router)
app.use("/admin-ibizapropiedades-dashboard", /* isAuthenticated, */ dashboard_router)
app.use("/admin-ibizapropiedades-dashboard", /* isAuthenticated, */ usuarios_router)
app.use("/admin-ibizapropiedades-dashboard", /* isAuthenticated, */ propietarios_router)
app.use("/admin-ibizapropiedades-dashboard", /* isAuthenticated, */ propiedades_router)


export default server;