// helpers.js
import handlebars from 'handlebars';
import moment from 'moment';

// Configura el idioma de moment a español
moment.locale('es');

handlebars.registerHelper('eq', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('formatNumber', function (number) {
  if (!Number.isInteger(number)) {
    return number;
  }

  // Convierte el número a cadena y divide los miles con puntos
  const formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return formattedNumber;
});

handlebars.registerHelper('esMayorQueCero', function(valor, opciones) {
  if (valor > 0) {
    return opciones.fn(this);
  } else {
    return opciones.inverse(this);
  }
});

handlebars.registerHelper('formatDate', function (date) {
  return moment(date).format('MM/DD/YYYY');
});

handlebars.registerHelper('formatFecha', function (fecha) {
  // Devuelve el formato deseado
  return moment(fecha).format('dddd, MMMM D, YYYY h:mm A');
});

handlebars.registerHelper('formatTexto', function (texto) {
  // Limitar el texto a 300 caracteres y añadir puntos suspensivos al final
  if (texto.length > 300) {
      return texto.substring(0, 100) + '...';
  } else {
      return texto;
  }
});

export default handlebars;

