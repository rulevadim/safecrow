module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order', 'stylelint-config-prettier'],
  plugins: ['stylelint-media-use-custom-media', 'stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'no-empty-source': null,
    'csstools/media-use-custom-media': [
      'always-known',
      {
        importFrom: ['./src/css/_breakpoints.css'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['import-normalise'],
      },
    ],
  },
};
