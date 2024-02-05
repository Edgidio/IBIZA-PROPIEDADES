import {PrismaClient} from "@prisma/client"
const db = new PrismaClient();

export const obtenerUsuariosGET = async (req, res) => {
    try {

        const usuarios = await db.usuarios.findMany();

        // Informacion para la navegacion necesaria    
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

        const Correos = await db.correos_ibiza.findMany({
            where: {
                visto: false
            }
        });
        
        const N_correos = await db.correos_ibiza.count({
            where: {
            visto: false,
            },
        });
        // FIN Informacion para la navegacion necesaria 
    
        return res.render("partials/dashboard/usuarios", {
          Titulo: "Ibiza Prop | Usuarios",
          Inicios_de_sesiones: Inicios_de_sesiones,
          N_inicios,
          usuarios,
          usuarioEliminado: req.flash('usuarioEliminado'),
          rutaIF: "Backend",
          Correos,
          N_correos
        })

      } catch (error) {
        
              // Manejo de errores y redirección en caso de problemas
              await db.log_sistema.create({
                  data: {
                      controlador: "obtenerUsuariosGET",
                      error: error.toString()
                  },
              });
        
              req.flash('error_controlador', 'Hubo un problema interno en el servidor');
      
              return res.redirect("/admin-ibizapropiedades-dashboard/usuarios");
    }
};

export const CrearUsuarioGET = async (req, res) => {
  try {

        // Informacion para la navegacion necesaria    
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

      const Correos = await db.correos_ibiza.findMany({
          where: {
              visto: false
          }
      });
      
      const N_correos = await db.correos_ibiza.count({
          where: {
          visto: false,
          },
      });
      // FIN Informacion para la navegacion necesaria 

    return res.render("partials/dashboard/crear-usuario", {
      Titulo: "Ibiza Prop | Crear usuario administrador",
      Inicios_de_sesiones: Inicios_de_sesiones,
      N_inicios,
      req_nuevo_usuario: req.flash("nuevo_usuario"),
      req_usurio_existente: req.flash("usurio_existente"),
      req_campo_usuario_error: req.flash("campo_usuario_error"),
      rutaIF: "Backend",
      Correos,
      N_correos
    })


  } catch (error) {

          // Manejo de errores y redirección en caso de problemas
          await db.log_sistema.create({
              data: {
                  controlador: "CrearUsuarioGET",
                  error: error.toString()
              },
          });
    
          req.flash('error_controlador', 'Hubo un problema interno en el servidor');
  
          return res.redirect("/admin-ibizapropiedades-dashboard/crear-usuario");

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

    const nuevo_usuario = await db.usuarios.create({
        
      data: {
        usuario,
        password
      }

    })


    req.flash("nuevo_usuario", "Usuario administrador creado satisfactoriamente")

    return res.redirect("/admin-ibizapropiedades-dashboard/crear-usuario")

    } catch (error) {

          // Manejo de errores y redirección en caso de problemas
          await db.log_sistema.create({
              data: {
                  controlador: "CrearUsuarioPOST",
                  error: error.toString()
              },
          });
      
          req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde o comuniquese con su desarrollador');
    
          return res.redirect("/admin-ibizapropiedades-dashboard/crear-usuario");
    }

};

export const eliminarUsuarioPOST = async (req, res) => {
  try {

    const usuarioId = parseInt(req.params.id);

    // Verificar si el usuario existe antes de intentar eliminarlo
    const usuarioExistente = await db.usuarios.findUnique({
      where: {
        id: usuarioId,
      },
    });

    if (!usuarioExistente) {

      return res.redirect('/admin-ibizapropiedades-dashboard/usuarios'); 
    }

    const usuarioEliminado = await db.usuarios.delete({
      where: {
        id: usuarioId,
      },
    });

    req.flash('usuarioEliminado', 'Usuario eliminado satisfactoriamente.');

    return res.redirect('/admin-ibizapropiedades-dashboard/usuarios')

  } catch (error) {
    
        // Manejo de errores y redirección en caso de problemas
        await db.log_sistema.create({
          data: {
            controlador: "eliminarUsuarioPOST",
            error: error.toString()
          },
        });
    
        req.flash('error_controlador', 'Hubo un problema al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');
        return res.redirect("/admin-ibizapropiedades-dashboard/usuarios");

  }
};
