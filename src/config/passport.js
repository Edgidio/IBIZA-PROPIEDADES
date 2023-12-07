// Importaciones de paquetes NPM
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient } from '@prisma/client';

import {socket} from "./socket.io.js"

// Conexion a base de datos
const db = new PrismaClient();

passport.use(

  new LocalStrategy( {

    usernameField: "usuario",
    passwordField: "password",
    passReqToCallback: true

  }, async (req, usuario, password, done) => {

    try {

      const ipAddress = req.clientIp;

      const Usuario = await db.usuarios.findUnique({

        where: { usuario: usuario },

      });



      if (!Usuario) {
       
        const Iusuario = await db.log_sesiones.create({
          data: {
            sesion: false,
            usuario: usuario,
            direccion_IP: ipAddress
          }
        })

        const N_inicios = await db.log_sesiones.count({
          where: {
          visto: false,
          },
        });

        socket.io.emit("inicio_de_sesion", {Iusuario, N_inicios}) 

        const errors =  {
            field: 'usuario',
            emssage: 'Usuario incorrecto',
        };

        req.flash('passU', 'Usuario o contraseña incorrecta');

        return done(null, false, { errors });

      }

      const passwordMatch = Usuario.password === password;


      if (!passwordMatch) {
       
        const Iusuario = await db.log_sesiones.create({
          data: {
            sesion: false,
            usuario: usuario,
            direccion_IP: ipAddress
          }
        })

        const N_inicios = await db.log_sesiones.count({
            where: {
            visto: false,
            },
        });

        socket.io.emit("inicio_de_sesion", {Iusuario, N_inicios}) 

        const errors =  {
          field: 'contraseña',
          emssage: 'Contraseña incorrecta',
        };

        req.flash('passU', 'Usuario o contraseña incorrecta');

        return done(null, false, { errors });
      }

      const Iusuario = await db.log_sesiones.create({
        data: {
          sesion: true,
          usuario: usuario,
          direccion_IP: ipAddress
        }
      })

      const N_inicios = await db.log_sesiones.count({
          where: {
          visto: false,
          },
      });

      socket.io.emit("inicio_de_sesion", {
        N_inicios,
        Iusuario
      }) 

      return done(null, Usuario);

    } catch (error) {
      return done(error);
    }
  })
);


passport.serializeUser((usuario, done) => {
  console.log( "serializeUser", usuario.id )
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const Usuario = await db.usuarios.findUnique({
      where: { id },
    });
    console.log("deserializeUser", Usuario)
    done(null, Usuario);
  } catch (error) {
    done(error);
  }
});

export default passport;