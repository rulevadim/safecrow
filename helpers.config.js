const path = require('path');
const partnersDir = 'src/partners';
const partner = process.env.VUE_APP_PARTNER;
const varFileName = `variables.${partner.split('-')[0]}.css`;

exports.alias = '@cssVariables';
exports.cssVariables = partner
  ? path.join(__dirname, partnersDir, partner, varFileName)
  : path.join(__dirname, 'src/css/variables.default.css');
exports.publicDir = path.join(__dirname, partnersDir, partner, 'public');
