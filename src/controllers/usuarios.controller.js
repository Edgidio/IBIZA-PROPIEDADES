import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

export const obtenerUsuariosGET = async (req, res) => {
    try {

        const usuarios = await db.usuarios.findMany();

        const Inicios_de_sesiones = await db.log_sesiones.findMany({
          where: {
              visto: false
          }
         });
      
         const N_inicios = await db.log_sesiones.count({
              where: {
              visto: false,
              },
          });
    
        res.render("partials/dashboard/usuarios", {
          Titulo: "Ibiza Prop | Usuarios admin",
          Inicios_de_sesiones: Inicios_de_sesiones,
          N_inicios,
          usuarios,
          ruta: "/usuarios",
          usuarioEliminado: req.flash('usuarioEliminado'),
          rutaIF: "Backend"
        })

      } catch (error) {
        
        res.send(`<h3 style="color: tomato; text-align: center;">Detectamos un error no validado en las respuestas HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.</h3> ${error}`)
           .status(500)
    }
};

export const CrearUsuarioGET = async (req, res) => {
  try {

    const Inicios_de_sesiones = await db.log_sesiones.findMany({
      where: {
          visto: false
      }
     });
  
     const N_inicios = await db.log_sesiones.count({
          where: {
          visto: false,
          },
      });

    res.render("partials/dashboard/crear-usuario", {
      Titulo: "Ibiza Prop | Crear usuario administrador",
      Inicios_de_sesiones: Inicios_de_sesiones,
      N_inicios,
      ruta: "/crear-usuarios",
      req_nuevo_usuario: req.flash("nuevo_usuario"),
      req_usurio_existente: req.flash("usurio_existente"),
      req_campo_usuario_error: req.flash("campo_usuario_error"),
      rutaIF: "Backend"
    })


  } catch (error) {

  }

};

export const CrearUsuarioPOST = async (req, res) => {
  try {

        // Extraer datos del cuerpo de la solicitud
    const { usuario, password } = req.body;

    // Verificar si ya existe un usuario con el mismo nombre de usuario
    const usuarioExistente = await db.usuarios.findUnique({
      where: { usuario: usuario },
    });

    if (usuarioExistente) {

      req.flash('usurio_existente', 'Nombre de usuario ya en uso. Por favor, elige otro.')
      req.flash("campo_usuario_error", usuario)

      return res.redirect("/admin-ibizapropiedades-dashboard/crear-usuario")
    }

    console.log(usuarioExistente)

    const nuevo_usuario = await db.usuarios.create({
        
      data: {
        usuario,
        password
      }

    })


    req.flash("nuevo_usuario", "Usuario administrador creado satisfactoriamente")

    res.redirect("/admin-ibizapropiedades-dashboard/crear-usuario")

    } catch (error) {

    res.send(`Se ha detectado un error no validado en tu solicitud HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final. ${error}`)
    }

};

export const eliminarUsuarioPOST = async (req, res) => {
  try {

    const usuarioId = parseInt(req.params.id);

    const usuarioEliminado = await db.usuarios.delete({
      where: {
        id: usuarioId,
      },
    });

    req.flash('usuarioEliminado', 'Usuario eliminado satisfactoriamente.');

    res.redirect('/admin-ibizapropiedades-dashboard/usuarios')

  } catch (error) {
    
    res.status(500).json({ error: 'Se ha detectado un error no validado en tu solicitud HTTP durante la fase de desarrollo de la aplicación. Estamos trabajando activamente para gestionar estas excepciones y garantizar la estabilidad del sistema antes de su implementación final.' });

  }
};
