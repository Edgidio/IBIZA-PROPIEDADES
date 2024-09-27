import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

import {socket} from "../config/socket.io.js"
import { lenguaje } from "../helpers/languaje.js";

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
      rutas: propiedad.ruta_unica ? propiedad.ruta_unica[0] : null,

    };
  });

  const propiedadesEnExhibicion = await db.propiedades.findMany({
    where: { enExhibicion: true },
    include: {
      fotos: true // Incluir todas las imágenes asociadas a la propiedad
    }
  });

  const propiedadesExhibicion = propiedadesEnExhibicion.map((propiedad) => {
    const primeraRuta = propiedad.fotos?.[0]?.rutas[0];
  
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
      rutas: primeraRuta,
      enExhibicion: propiedad.enExhibicion
    };
  });

    const t = await lenguaje(req, "index.json")

    console.log(t.services.sold_homes)
  
    return res.render('partials/frontend/index', {
      Titulo: "Ibiza Propiedades",
      rutaIF: "Frontend",
      propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
      propiedadesExhibicion,
      t
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/*  */

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

  const t = await lenguaje(req, "propiedad.json")

  res.render('partials/frontend/propiedad', {
    Titulo: "Ibiza Propiedades | Propiedad",
    rutaIF: "Frontend",
    primeraFotoS: fotosLimitadas[0],
    propiedadConFotos,
    fotosLimitadas,
    fotosPropiedad: todasLasFotos,
    propiedadesConRutaUnica,
    t,
    correo_propiedad_enviado: req.flash('correo_propiedad_enviado')
  });

  } catch (error) {

    res.status(500).json({ error: 'Error interno del servidor' });
  }

};

export const propiedadPOST = async (req, res) => {

  try {
    const id = req.params.id;
    const {...datosFormulario} = req.body;

    // Buscar la propiedad por id en la base de datos usando Prisma Client
    const propiedad = await db.propiedades.findUnique({
      where: {
        id: parseInt(id), // Asegúrate de convertir 'id' a un número
      },
    });

    if (!propiedad) {
      req.flash('correo_propiedad_no_enviado', 'Correo no enviado');
      return res.redirect(`/propiedadssssssssss/${id}`);
    }

    const newCorreoPropiedad = await db.correos_propiedad.create({
      data: {
        correo: datosFormulario.email,
        nombre: datosFormulario.name,
        telefono: datosFormulario.phone,
        idPropiedad: id,
      },
    });

    req.flash('correo_propiedad_enviado', 'Correo enviado');
    return res.redirect(`/propiedad/${id}`);

  } catch (error) {

    res.status(500).json({ error: 'Error interno del servidor' });
  }

};

export const contacto = async (req, res) => {

  try {

    const t = await lenguaje(req, "contacto.json")

    res.render('partials/frontend/contacto', {
      Titulo: "Ibiza Propiedades | Contacto",
      rutaIF: "Frontend",
      correo_enviado: req.flash('correo_enviado'),
      correo_no_enviado:req.flash('correo_no_enviado'),
      t
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const contactoPOST = async (req, res) => {
  try {
    // Extraer la información del formulario
    const { nombre, correo, asunto, mensaje, telefono } = req.body;

    // Crear un registro en la base de datos con la información del formulario
    const nuevoCorreo = await db.correos_ibiza.create({
      data: {
        nombre: nombre,
        telefono: telefono,
        correo_usuario: correo,
        asunto: asunto,
        mensaje: mensaje,
      },
    });


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

    const t = await lenguaje(req, "sobre_nosotros.json")

    res.render('partials/frontend/sobre_nosotros', {
      Titulo: 'Ibiza Propiedades | Sobre nosotros',
      rutaIF: 'Frontend',
      t
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

    if (inmueble.includes('Apartamento')) {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'A', // o el valor correspondiente para Apartamento
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    } else if (inmueble.includes('Casa')) {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'C', // o el valor correspondiente para Casa
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    } else if (inmueble.includes('Terreno')) {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'T', // o el valor correspondiente para Terreno
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    } else if (inmueble.includes('Local comercial')) {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'LC', // o el valor correspondiente para Local comercial
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    } else if (inmueble.includes('Oficina')) {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'OF', // o el valor correspondiente para Oficina
          venta_renta: venta_renta,
          estado: estado,
        },
        include: {
          fotos: true,
        },
      });
    } else if (inmueble.includes('Edificio')) {
      propiedades = await db.propiedades.findMany({
        where: {
          tipo_propiedad: 'E', // o el valor correspondiente para Edificio
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

    const t = await lenguaje(req, "busqueda.json")


    return res.render('partials/frontend/busqueda', {
      Titulo: "Ibiza Propiedades | Busqueda",
      rutaIF: "Frontend",
      propiedadesConUnaRutaPorFoto: propiedadesConRutaUnica,
      t
    });

  } catch (error) {
    return res.redirect("/")
  }
};

export const valore_su_propiedad_GET = async (req, res) => {

  try {

    return res.render('partials/frontend/venda_su_propiedad', {
      Titulo: "Ibiza Propiedades | Venda su propiedad",
      rutaIF: "Frontend",
      valoracion_enviada: req.flash("valoracion_enviada")
    });

  } catch (error) {
    return res.redirect("/")
  }
};


export const valore_su_propiedad_POST = async (req, res) => {

  try {
   
    const {
      ubicacion,
      numeroCasa,
      tipoPropiedad,
      plantaApartamento,
      puertaBloque,
      superficieConstruidaApartamento,
      superficieConstruida,
      areaTerreno,
      numHabitaciones,
      numBanios,
      EstadoPropiedad,
      caracteristica,
      nombre,
      Apellidos,
      correo,
      telefono,
      contactar,
    } = req.body;

    if (!Array.isArray(contactar)) {
      // Si contactar es un string, lo convertimos en un array
      contactar = [contactar];
    }
  
      const nuevaPropiedad = await db.valorarPropiedades.create({
        data: {
          ubicacion,
          numeroCasa: numeroCasa ? parseInt(numeroCasa) : null,
          tipoPropiedad,
          plantaApartamento,
          puertaBloque,
          superficieConstruidaApartamento: superficieConstruidaApartamento ? parseFloat(superficieConstruidaApartamento) : null,
          superficieConstruida: superficieConstruida ? parseFloat(superficieConstruida) : null,
          areaTerreno: areaTerreno ? parseFloat(areaTerreno) : null,
          numHabitaciones: numHabitaciones ? parseInt(numHabitaciones) : null,
          numBanios: numBanios ? parseInt(numBanios) : null,
          EstadoPropiedad,
          caracteristica,
          nombre,
          Apellidos,
          correo,
          telefono,
          contactar,
        },
      });

      console.log("guardo")

      req.flash("valoracion_enviada", "La valoración fue enviada")  
      return res.redirect("/venda-su-propiedad");


  } catch (error) {
    console.log(error)
  }
};