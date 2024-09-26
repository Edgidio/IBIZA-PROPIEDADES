// helpers.js
import handlebars from 'handlebars';
import moment from 'moment';

// Configura el idioma de moment a español
moment.locale('es');

handlebars.registerHelper('eq', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('eqq', function (a, b, options) {
  return a === b;
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

  const ahora = moment();
  const fechaMoment = moment(date);
  
  // Calcula la diferencia total en milisegundos
  const duracion = moment.duration(ahora.diff(fechaMoment));

  // Obtén los días, horas y minutos de la duración
  const dias = Math.floor(duracion.asDays());
  const horas = Math.floor(duracion.asHours()) % 24;
  const minutos = Math.floor(duracion.asMinutes()) % 60;

  // Decide qué unidad mostrar
  if (dias > 0) {
    return dias + (dias === 1 ? ' día' : ' días');
  } else if (horas > 0) {
    return horas + (horas === 1 ? ' hora' : ' horas');
  } else {
    return minutos + (minutos === 1 ? ' minuto' : ' minutos');
  }
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

