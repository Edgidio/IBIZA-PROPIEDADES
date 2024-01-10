export const index = async (req, res) => {
    try {

        res.render('partials/frontend/index', {
            Titulo: "Ibiza Propiedades",
            rutaIF: "Frontend"
        });
      
    }catch (error) {
        


    }
};