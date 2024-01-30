export const loginGET = async (req, res) => {
    try {

        res.render('partials/dashboard/login', {
            Titulo: "Ibiza Prop | Inicio de Sesión",
            passU: req.flash('passU'),
            rutaIF: "Backend"
        });
      
    }catch (error) {
        


    }
};

export const cerrarSesionGET = async (req, res) => {
    try {

        req.logout( (err) => {

            if (err) {
              return next(err);
            }

            return res.redirect('/admin-ibizapropiedades/login');
        });
      
    }catch (error) {
        
        

    }
};