import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

import {socket} from "../config/socket.io.js"

/* import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

import nodemailer from 'nodemailer';
import { google } from 'googleapis'; */

// Configuración de OAuth

/* const credentials = {
  web: {
    client_id: "417205431041-l6i4356qko5ejpgskofglocv228iheu9.apps.googleusercontent.com",
    project_id: "prueba-ibiza-propiedades",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "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",
    redirect_uris: ["https://developers.google.com/oauthplayground"]
  }
};

const { web: { client_id, client_secret, redirect_uris } } = credentials;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials({
  refresh_token: '1//04N-LQ5vAO9AGCgYIARAAGAQSNwF-L9Irh89aegFAo6pX3X1CQGd2Vp3mJFTJIM_OBVdXy9Y48OAEcawCA06veCsKrBa6xR-wXDw',
  access_token: 'ya29.a0AfB_byA06raVhEOTVOIy_epGMWkWRIAxLj37NeNuTgsYH1_IgshsuJprEJJwBTh6CdpeIm-1ebdd2SARX1Td0A9E1MqEPuU1waPX3aMXIHCcIuU5YwXNxXTJoXXoeoy1jXANJbWt-ShCVJEXbZO1Ov1fpQ0Mc662iQwfaCgYKAUASARISFQHGX2MiTo1xiTLz3mGO9IenTBOBhw0171',
});

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'edgidio.leon@gmail.com',
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: oAuth2Client.credentials.refresh_token,
    accessToken: oAuth2Client.credentials.access_token,
  },
});

 */

export const index = async (req, res) => {
  try {

    const propiedades = await db.$queryRaw`
    SELECT
      p.*,
      (
        SELECT rutas
        FROM "Propiedades_img" pi
        WHERE pi.id_propiedad = p.id
        ORDER BY RANDOM()
        LIMIT 1
      ) AS ruta_unica
    FROM "Propiedades" p
    ORDER BY RANDOM()
    LIMIT 6;
  `;
  
  const propiedadesConRutaUnica = propiedades.map((propiedad) => {
    return {
      id: propiedad.id,
      id_propietario: propiedad.id_propietario,
      descripcion: propiedad.descripcion,
      detalles: propiedad.detalles,
      ubicacion: propiedad.ubicacion,
      precio: propiedad.precio,
      venta_renta: propiedad.venta_renta,
      n_habitaciones: propiedad.n_habitaciones,
      n_banos: propiedad.n_banos,
      superficie: propiedad.superficie,
      terreno: propiedad.terreno,
      tipo_propiedad: propiedad.tipo_propiedad,
      vendida: propiedad.vendida,
      createdAt: propiedad.createdAt,
      updatedAt: propiedad.updatedAt,
      usuarioId: propiedad.usuarioId,
      estado: propiedad.estado,
      rutas: propiedad.ruta_unica[0],
    };
  });

    res.render('partials/frontend/index', {
      Titulo: "Ibiza Propiedades",
      rutaIF: "Frontend",
      propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const propiedad = async (req, res) => {

  try {

    const propiedadId = parseInt(req.params.id);

    // Validar si el parámetro es un número
    if (isNaN(propiedadId)) {
      // Redireccionar a otra página si el parámetro no es un número
      return res.redirect('/pagina-no-encontrada');
    }

    if (propiedadId >= 2000000000) {
      // Redireccionar a otra página si el es mayor al escrito
      return res.redirect('/pagina-no-encontrada');
    }

    const propiedad_existe = await db.propiedades.findUnique({
      where: {
        id: propiedadId,
    }});


    // Validar si la propiedad existe
    if (!propiedad_existe) {
      // Redireccionar a otra página si la propiedad no existe
      return res.redirect('/pagina-no-encontrada');
    }

    const propiedadConFotos = await db.propiedades.findUnique({
      where: {
        id: propiedadId,
      },
      include: {
        fotos: {
          select: {
            rutas: true,
            createdAt: true,
            updatedAt: true,
          },
          take: 3, // Tomar solo 3 fotos
        },
      },
    });
    
    // Verificar si la propiedad tiene fotos
    const fotosPropiedad = propiedadConFotos?.fotos?.length > 0
      ? propiedadConFotos.fotos[0].rutas
      : [];
    
    // Tomar solo 3 
    const fotosLimitadas = fotosPropiedad.length > 0 ? fotosPropiedad.slice(0, 3) : [];
    const todasLasFotos = propiedadConFotos?.fotos?.[0].rutas || []; 
    
    // Propiedades relacionadas
    const tipoPropiedadDeseado = propiedadConFotos.tipo_propiedad;

    const propiedades = await db.$queryRaw`
    SELECT p.*, pi.rutas
    FROM "Propiedades" p
    LEFT JOIN "Propiedades_img" pi ON p.id = pi.id_propiedad
    WHERE p.tipo_propiedad = ${tipoPropiedadDeseado}
    ORDER BY RANDOM()
    LIMIT 3
  `;

  // Itera sobre cada propiedad en el array y selecciona solo una ruta de imagen
  const propiedadesConRutaUnica = propiedades.map((propiedad) => {
    const primeraRuta = propiedad.rutas[0];

    // Crea un nuevo objeto con la información de la propiedad y la ruta seleccionada
    return {
        id: propiedad.id,
        id_propietario: propiedad.id_propietario,
        descripcion: propiedad.descripcion,
        detalles: propiedad.detalles,
        ubicacion: propiedad.ubicacion,
        precio: propiedad.precio,
        venta_renta: propiedad.venta_renta,
        n_habitaciones: propiedad.n_habitaciones,
        n_banos: propiedad.n_banos,
        superficie: propiedad.superficie,
        terreno: propiedad.terreno,
        tipo_propiedad: propiedad.tipo_propiedad,
        vendida: propiedad.vendida,
        createdAt: propiedad.createdAt,
        updatedAt: propiedad.updatedAt,
        usuarioId: propiedad.usuarioId,
        estado: propiedad.estado,
        // Solo incluye la ruta seleccionada en el nuevo objeto
        rutas: primeraRuta,
      };
  });

  res.render('partials/frontend/propiedad', {
    Titulo: "Ibiza Propiedades | Propiedad",
    rutaIF: "Frontend",
    primeraFotoS: fotosLimitadas[0],
    propiedadConFotos,
    fotosLimitadas,
    fotosPropiedad: todasLasFotos,
    propiedadesConRutaUnica
  });

  } catch (error) {

    res.status(500).json({ error: 'Error interno del servidor' });
  }

};

export const contacto = async (req, res) => {

  try {

    res.render('partials/frontend/contacto', {
      Titulo: "Ibiza Propiedades | Contacto",
      rutaIF: "Frontend",
      correo_enviado: req.flash('correo_enviado'),
      correo_no_enviado:req.flash('correo_no_enviado')
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



/* export const contactoPOST = async (req, res) => {

  try {
    // Extraer la información del formulario
    const { nombre, correo, asunto, mensaje } = req.body;

    const mailOptions = {
      from: 'edgidio.leon@gmail.com',
      to: 'administrador@ibizapropiedades.com.ve',
      subject: asunto,
      html: `
      <h1>Jablame</>
  `,
    };

    // Envío del correo
    const result = await transporter.sendMail(mailOptions);

    const nuevoCorreo = await db.correos_ibiza.create({
      data: {
        nombre:nombre,
        correo_usuario: correo,
        asunto: asunto,
        mensaje: mensaje,
      },
    });

    req.flash('correo_enviado', `Gracias, ${nombre}. Su correo ha sido enviado correctamente. Nos pondremos en contacto con usted pronto.`);
    
    const N_correos = await db.correos_ibiza.count({
      where: {
      visto: false,
      },
    });

    socket.io.emit("envio_de_correo", N_correos)
    
    return res.redirect("/contacto")
  
  } catch (error) {

    // Guardar el error en la tabla log_sistema
    await db.log_sistema.create({
      data: {
        controlador: "ContactoPOTS",
        error: error.toString()
      },
    });

    req.flash('correo_no_enviado', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');
    return res.redirect("/contacto")
  }
}; */




export const contactoPOST = async (req, res) => {
  try {
    // Extraer la información del formulario
    const { nombre, correo, asunto, mensaje } = req.body;

    // Crear un registro en la base de datos con la información del formulario
    const nuevoCorreo = await db.correos_ibiza.create({
      data: {
        nombre: nombre,
        correo_usuario: correo,
        asunto: asunto,
        mensaje: mensaje,
      },
    });

    /* // Enviar respuesta automática por correo electrónico al remitente
    const msg = createMimeMessage();
    msg.setHeader("In-Reply-To", "<Message-ID-del-correo-entrante>");
    msg.setSender({ name: "Nombre del Remitente", addr: "<SENDER>@example.com" });
    msg.setRecipient(correo);
    msg.setSubject("Respuesta Automática - Asunto del Correo");
    msg.addMessage({
      contentType: 'text/plain',
      data: `Gracias por ponerte en contacto, ${nombre}. Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.`
    });

    const replyMessage = new EmailMessage(
      "<SENDER>@example.com",
      correo,
      msg.asRaw()
    );

    // Enviar la respuesta automática por correo electrónico
    await nuevoCorreo.reply(replyMessage); */

    // Resto del código para la gestión de correos y redirección
    req.flash('correo_enviado', `Gracias, ${nombre}. Su correo ha sido enviado correctamente. Nos pondremos en contacto con usted pronto.`);
    
    const Nn_correos = await db.correos_ibiza.findMany({
      where: {
        visto: false,
      },
    });

    const N_correos = await db.correos_ibiza.count({
      where: {
        visto: false,
      },
    });

    const data = {
      N_correos,
      Nn_correos
    }

    socket.io.emit("envio_de_correo", data)
    
    return res.redirect("/contacto");
  } catch (error) {
    // Manejo de errores y redirección en caso de problemas
    await db.log_sistema.create({
      data: {
        controlador: "ContactoPOTS",
        error: error.toString()
      },
    });

    req.flash('correo_no_enviado', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');
    return res.redirect("/contacto");
  }
};

export const sobre_Nosotros = async (req, res) => {

  try {



    res.render('partials/frontend/sobre_nosotros', {
      Titulo: "Ibiza Propiedades | Sobre nosotros",
      rutaIF: "Frontend",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const busquedaPropiedades = async (req, res) => {

  try {

    const { inmueble, venta_renta, estado } = req.body;

    // Validar que inmueble sea un string y tenga una longitud adecuada
    if (typeof inmueble !== 'string' || inmueble.length > 100) {
      return res.render('partials/frontend/busqueda', {
              Titulo: "Ibiza Propiedades | Busqueda",
              rutaIF: "Frontend",
            });
    }

    // Validar que venta_renta sea un string y contenga solo 'R' o 'V'
    if (typeof venta_renta !== 'string' || !['R', 'V'].includes(venta_renta)) {
      return res.render('partials/frontend/busqueda', {
        Titulo: "Ibiza Propiedades | Busqueda",
        rutaIF: "Frontend",
      });
    }

    // Validar que estado sea un string y tenga una longitud adecuada
    if (typeof estado !== 'string' || estado.length > 20) {
      return res.render('partials/frontend/busqueda', {
        Titulo: "Ibiza Propiedades | Busqueda",
        rutaIF: "Frontend",
      });
    }

    let propiedades;
    
    if (inmueble === 'Propiedad Terreno') {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'T',
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    } else if (inmueble === 'Condominio') {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: { in: ['A', 'C', 'E'] },
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    } else if (inmueble === 'Edificio comercial') {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: { in: ['LC', 'OF'] },
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    }

    // Verificar la longitud de propiedades
    if (!propiedades) {

      return res.render('partials/frontend/busqueda', {
        Titulo: "Ibiza Propiedades | Busqueda",
        rutaIF: "Frontend"
      });

    }
    
    // Itera sobre cada propiedad en el array y selecciona solo una ruta de imagen
    const propiedadesConRutaUnica = propiedades.map((propiedad) => {
      const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
    
      // Crea un nuevo objeto con la información de la propiedad y la ruta seleccionada
      return {
        id: propiedad.id,
        id_propietario: propiedad.id_propietario,
        descripcion: propiedad.descripcion,
        detalles: propiedad.detalles,
        ubicacion: propiedad.ubicacion,
        precio: propiedad.precio,
        venta_renta: propiedad.venta_renta,
        n_habitaciones: propiedad.n_habitaciones,
        n_banos: propiedad.n_banos,
        superficie: propiedad.superficie,
        terreno: propiedad.terreno,
        tipo_propiedad: propiedad.tipo_propiedad,
        vendida: propiedad.vendida,
        createdAt: propiedad.createdAt,
        updatedAt: propiedad.updatedAt,
        usuarioId: propiedad.usuarioId,
        estado: propiedad.estado,
        // Solo incluye la ruta seleccionada en el nuevo objeto
        rutas: primeraRuta,
      };
    });


    return res.render('partials/frontend/busqueda', {
      Titulo: "Ibiza Propiedades | Busqueda",
      rutaIF: "Frontend",
      propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};