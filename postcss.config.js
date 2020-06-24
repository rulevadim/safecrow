const path = require('path');
const postcssImport = require('postcss-import');
const postcssNormalize = require('postcss-normalize');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCustomProperties = require('postcss-custom-properties');
const autoprefixer = require('autoprefixer');
const { alias, cssVariables } = require('./helpers.config');

module.exports = {
  plugins: [
    // postcssNormalize,
    postcssImport(
      postcssNormalize().postcssImport({
        resolve(id, dir) {
          if (id == `~${alias}`) {
            return path.resolve(cssVariables);
          }
          return path.resolve(dir, id);
        },
      })
    ),
    postcssCustomMedia({
      importFrom: ['./src/css/_breakpoints.css'],
    }),
    postcssCustomProperties({
      importFrom: ['./src/css/variables.default.css', cssVariables],
      preserve: process.env.NODE_ENV === 'production' ? false : true,
      // preserve: false,
    }),
    autoprefixer,
  ],
  // plugins: {
  //     "postcss-normalize": {},
  //     "postcss-custom-media": {
  //         importFrom: ["./src/css/_breakpoints.css"],
  //     },
  //     "postcss-custom-properties": {
  //         // importFrom: partnerCssVars,
  //         // preserve: process.env.NODE_ENV === "production" ? "false" : "true",
  //         preserve: false,
  //     },
  //     autoprefixer: {},
  // },
};
