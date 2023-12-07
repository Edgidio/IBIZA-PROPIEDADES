// helpers.js
import handlebars from 'handlebars';

handlebars.registerHelper('eq', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

export default handlebars;