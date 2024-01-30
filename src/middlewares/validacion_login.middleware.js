import { loginSchema } from '../validators/validacion_login.js';

// Middleware para validar el formulario de inicio de sesión
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      // Hay errores de validación
      const errors = error.details.map((err) => {
        return {
          field: err.context.label,
          emssage: err.message,
        };
      });


/*       return  res.json(errors) */
  
      return res.status(400).render('partials/dashboard/login',
        { 
            message: 'Error de validación',
            errors,
            rutaIF: "Backend"
        });
    }
  
    // La validación fue exitosa, continuar con la ejecución normal
    next();
  };
  
  export { validateLogin };