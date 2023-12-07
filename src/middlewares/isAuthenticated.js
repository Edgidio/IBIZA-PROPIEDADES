
export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/admin-ibizapropiedades/login');
}

export function isAuthenticatedLogin (req, res, next) {

  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/admin-ibizapropiedades-dashboard'); // Redirige al panel de control si ya está autenticado
}; 

