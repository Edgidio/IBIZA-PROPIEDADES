import axios from 'axios';
import { Router } from 'express';
import cookieParser from 'cookie-parser';

const i18nRouter = Router();

i18nRouter.use(cookieParser());

i18nRouter.use(async (req, res, next) => {

    let lang;

    try {

      const ipAddress = req.clientIp;  

      const geoResponse = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
      const country = geoResponse.data.country;

      if (country === 'ES') {
        lang = 'es';
      } else {
        lang = 'en';
      }

      res.cookie('lang', lang, { maxAge: 900000, httpOnly: true });
      

    } catch (error) {
      console.error('Error al obtener la geolocalización:', error);
      lang = 'es'; // Por defecto, si hay un error
    }

    next();

 
});

export default i18nRouter;