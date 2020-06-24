module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        mocha: true,
      },
    },
  ],
  ignorePatterns: ['*.config.js', '*.mock.ts', '/tests/**/*.*'],
};

// module.exports = {
//   root: true,
//   env: {
//       node: true,
//   },
//   plugins: ["@typescript-eslint", "smells", "filenames", "eslint-plugin-local-rules"],
//   extends: [
//       "plugin:vue/base",
//       "plugin:vue/essential",
//       "plugin:vue/strongly-recommended",
//       "plugin:vue/recommended",

//       "@vue/prettier",
//       "@vue/typescript",
//   ],
//   rules: {
//       "local-rules/no-data-name": "error",
//       "vue/no-restricted-syntax": "error",
//       "vue/v-on-function-call": "error",
//       "@typescript-eslint/no-unused-vars": "error",
//       "filenames/match-regex": [2, "^[a-z_.-]+$", true],
//       "no-console": "error",
//       "no-debugger": "error",
//       "member-access": [true, "no-public"],
//       "variable-name": [
//           true,
//           "ban-keywords",
//           "check-format",
//           "allow-pascal-case",
//           "allow-leading-underscore",
//           "allow-snake-case",
//       ],
//       quotemark: [true, "double"],
//       "ordered-imports": false,
//       "import-spacing": true,
//       "object-literal-sort-keys": false,
//       "no-consecutive-blank-lines": false,
//       "no-trailing-whitespace": true,
//       semicolon: [true, "always"],
//       eofline: true,
//       "trailing-comma": [
//           true,
//           {
//               multiline: "always",
//               singleline: "never",
//           },
//       ],
//       "interface-name": false,
//       whitespace: [
//           true,
//           "check-branch",
//           "check-decl",
//           "check-operator",
//           "check-module",
//           "check-separator",
//           "check-rest-spread",
//           "check-type",
//           "check-type-operator",
//       ],
//       "smells/no-switch": "error",
//       "smells/no-complex-switch-case": "error",
//       "smells/no-setinterval": "error",
//       "smells/no-this-assign": "error",
//       "no-unexpected-multiline": "error",
//   },
//   parserOptions: {
//       parser: "@typescript-eslint/parser",
//   },
// };

// module.exports = {
//     env: {
//         node: true,
//         browser: true,
//         es6: true,
//     },
//     globals: {},
//     parser: "/Users/rulevadim/Repos/GitLab/referral-vue/node_modules/vue-eslint-parser/index.js",
//     parserOptions: {
//         ecmaVersion: 2020,
//         sourceType: "module",
//         parser: "/Users/rulevadim/Repos/GitLab/referral-vue/node_modules/@typescript-eslint/parser/dist/parser.js",
//         extraFileExtensions: [".vue"],
//         ecmaFeatures: {
//             jsx: true,
//         },
//     },
//     plugins: ["vue", "@typescript-eslint", "prettier"],
//     rules: {
//         "no-console": ["off"],
//         "no-debugger": ["off"],
//         "@typescript-eslint/quotes": [0],
//         "@typescript-eslint/brace-style": ["off"],
//         "@typescript-eslint/comma-spacing": ["off"],
//         "@typescript-eslint/func-call-spacing": ["off"],
//         "@typescript-eslint/indent": ["off"],
//         "@typescript-eslint/member-delimiter-style": ["off"],
//         "@typescript-eslint/no-extra-parens": ["off"],
//         "@typescript-eslint/no-extra-semi": ["off"],
//         "@typescript-eslint/semi": ["off"],
//         "@typescript-eslint/space-before-function-paren": ["off"],
//         "@typescript-eslint/type-annotation-spacing": ["off"],
//         "prettier/prettier": ["warn"],
//         "vue/html-self-closing": [0],
//         "vue/max-len": [0],
//         "vue/array-bracket-spacing": ["off"],
//         "vue/arrow-spacing": ["off"],
//         "vue/block-spacing": ["off"],
//         "vue/brace-style": ["off"],
//         "vue/comma-dangle": ["off"],
//         "vue/dot-location": ["off"],
//         "vue/html-closing-bracket-newline": ["off"],
//         "vue/html-closing-bracket-spacing": ["off"],
//         "vue/html-end-tags": ["off"],
//         "vue/html-indent": ["off"],
//         "vue/html-quotes": ["off"],
//         "vue/key-spacing": ["off"],
//         "vue/keyword-spacing": ["off"],
//         "vue/max-attributes-per-line": ["off"],
//         "vue/multiline-html-element-content-newline": ["off"],
//         "vue/mustache-interpolation-spacing": ["off"],
//         "vue/no-multi-spaces": ["off"],
//         "vue/no-spaces-around-equal-signs-in-attribute": ["off"],
//         "vue/object-curly-spacing": ["off"],
//         "vue/script-indent": ["off"],
//         "vue/singleline-html-element-content-newline": ["off"],
//         "vue/space-infix-ops": ["off"],
//         "vue/space-unary-ops": ["off"],
//         "arrow-body-style": [0],
//         curly: [0],
//         "lines-around-comment": [0],
//         "max-len": [0],
//         "no-confusing-arrow": [0],
//         "no-mixed-operators": [0],
//         "no-tabs": [0],
//         "no-unexpected-multiline": [0],
//         "prefer-arrow-callback": [0],
//         quotes: [0],
//         "array-bracket-newline": ["off"],
//         "array-bracket-spacing": ["off"],
//         "array-element-newline": ["off"],
//         "arrow-parens": ["off"],
//         "arrow-spacing": ["off"],
//         "block-spacing": ["off"],
//         "brace-style": ["off"],
//         "comma-dangle": ["off"],
//         "comma-spacing": ["off"],
//         "comma-style": ["off"],
//         "computed-property-spacing": ["off"],
//         "dot-location": ["off"],
//         "eol-last": ["off"],
//         "func-call-spacing": ["off"],
//         "function-call-argument-newline": ["off"],
//         "function-paren-newline": ["off"],
//         "generator-star": ["off"],
//         "generator-star-spacing": ["off"],
//         "implicit-arrow-linebreak": ["off"],
//         indent: ["off"],
//         "jsx-quotes": ["off"],
//         "key-spacing": ["off"],
//         "keyword-spacing": ["off"],
//         "linebreak-style": ["off"],
//         "multiline-ternary": ["off"],
//         "newline-per-chained-call": ["off"],
//         "new-parens": ["off"],
//         "no-arrow-condition": ["off"],
//         "no-comma-dangle": ["off"],
//         "no-extra-parens": ["off"],
//         "no-extra-semi": ["off"],
//         "no-floating-decimal": ["off"],
//         "no-mixed-spaces-and-tabs": ["off"],
//         "no-multi-spaces": ["off"],
//         "no-multiple-empty-lines": ["off"],
//         "no-reserved-keys": ["off"],
//         "no-space-before-semi": ["off"],
//         "no-trailing-spaces": ["off"],
//         "no-whitespace-before-property": ["off"],
//         "no-wrap-func": ["off"],
//         "nonblock-statement-body-position": ["off"],
//         "object-curly-newline": ["off"],
//         "object-curly-spacing": ["off"],
//         "object-property-newline": ["off"],
//         "one-var-declaration-per-line": ["off"],
//         "operator-linebreak": ["off"],
//         "padded-blocks": ["off"],
//         "quote-props": ["off"],
//         "rest-spread-spacing": ["off"],
//         semi: ["off"],
//         "semi-spacing": ["off"],
//         "semi-style": ["off"],
//         "space-after-function-name": ["off"],
//         "space-after-keywords": ["off"],
//         "space-before-blocks": ["off"],
//         "space-before-function-paren": ["off"],
//         "space-before-function-parentheses": ["off"],
//         "space-before-keywords": ["off"],
//         "space-in-brackets": ["off"],
//         "space-in-parens": ["off"],
//         "space-infix-ops": ["off"],
//         "space-return-throw-case": ["off"],
//         "space-unary-ops": ["off"],
//         "space-unary-word-ops": ["off"],
//         "switch-colon-spacing": ["off"],
//         "template-curly-spacing": ["off"],
//         "template-tag-spacing": ["off"],
//         "unicode-bom": ["off"],
//         "wrap-iife": ["off"],
//         "wrap-regex": ["off"],
//         "yield-star-spacing": ["off"],
//         "indent-legacy": ["off"],
//         "no-spaced-func": ["off"],
//         "@typescript-eslint/explicit-function-return-type": ["off"],
//         "@typescript-eslint/adjacent-overload-signatures": ["error"],
//         "@typescript-eslint/ban-ts-ignore": ["error"],
//         "@typescript-eslint/ban-types": ["error"],
//         camelcase: ["off"],
//         "@typescript-eslint/camelcase": ["error"],
//         "@typescript-eslint/class-name-casing": ["error"],
//         "@typescript-eslint/consistent-type-assertions": ["error"],
//         "@typescript-eslint/interface-name-prefix": ["error"],
//         "no-array-constructor": ["off"],
//         "@typescript-eslint/no-array-constructor": ["error"],
//         "no-empty-function": ["off"],
//         "@typescript-eslint/no-empty-function": ["error"],
//         "@typescript-eslint/no-empty-interface": ["error"],
//         "@typescript-eslint/no-explicit-any": ["warn"],
//         "@typescript-eslint/no-inferrable-types": ["error"],
//         "@typescript-eslint/no-misused-new": ["error"],
//         "@typescript-eslint/no-namespace": ["error"],
//         "@typescript-eslint/no-non-null-assertion": ["warn"],
//         "@typescript-eslint/no-this-alias": ["error"],
//         "no-unused-vars": ["off"],
//         "@typescript-eslint/no-unused-vars": ["warn"],
//         "no-use-before-define": ["off"],
//         "@typescript-eslint/no-use-before-define": ["error"],
//         "@typescript-eslint/no-var-requires": ["error"],
//         "@typescript-eslint/prefer-namespace-keyword": ["error"],
//         "@typescript-eslint/triple-slash-reference": ["error"],
//         "no-var": ["error"],
//         "prefer-const": ["error"],
//         "prefer-rest-params": ["error"],
//         "prefer-spread": ["error"],
//         "constructor-super": ["error"],
//         "for-direction": ["error"],
//         "getter-return": ["error"],
//         "no-async-promise-executor": ["error"],
//         "no-case-declarations": ["error"],
//         "no-class-assign": ["error"],
//         "no-compare-neg-zero": ["error"],
//         "no-cond-assign": ["error"],
//         "no-const-assign": ["error"],
//         "no-constant-condition": ["error"],
//         "no-control-regex": ["error"],
//         "no-delete-var": ["error"],
//         "no-dupe-args": ["error"],
//         "no-dupe-class-members": ["error"],
//         "no-dupe-keys": ["error"],
//         "no-duplicate-case": ["error"],
//         "no-empty": ["error"],
//         "no-empty-character-class": ["error"],
//         "no-empty-pattern": ["error"],
//         "no-ex-assign": ["error"],
//         "no-extra-boolean-cast": ["error"],
//         "no-fallthrough": ["error"],
//         "no-func-assign": ["error"],
//         "no-global-assign": ["error"],
//         "no-inner-declarations": ["error"],
//         "no-invalid-regexp": ["error"],
//         "no-irregular-whitespace": ["error"],
//         "no-misleading-character-class": ["error"],
//         "no-new-symbol": ["error"],
//         "no-obj-calls": ["error"],
//         "no-octal": ["error"],
//         "no-prototype-builtins": ["error"],
//         "no-redeclare": ["error"],
//         "no-regex-spaces": ["error"],
//         "no-self-assign": ["error"],
//         "no-shadow-restricted-names": ["error"],
//         "no-sparse-arrays": ["error"],
//         "no-this-before-super": ["error"],
//         "no-undef": ["error"],
//         "no-unreachable": ["error"],
//         "no-unsafe-finally": ["error"],
//         "no-unsafe-negation": ["error"],
//         "no-unused-labels": ["error"],
//         "no-useless-catch": ["error"],
//         "no-useless-escape": ["error"],
//         "no-with": ["error"],
//         "require-yield": ["error"],
//         "use-isnan": ["error"],
//         "valid-typeof": ["error"],
//         "vue/no-async-in-computed-properties": ["error"],
//         "vue/no-dupe-keys": ["error"],
//         "vue/no-duplicate-attributes": ["error"],
//         "vue/no-parsing-error": ["error"],
//         "vue/no-reserved-keys": ["error"],
//         "vue/no-shared-component-data": ["error"],
//         "vue/no-side-effects-in-computed-properties": ["error"],
//         "vue/no-template-key": ["error"],
//         "vue/no-textarea-mustache": ["error"],
//         "vue/no-unused-components": ["error"],
//         "vue/no-unused-vars": ["error"],
//         "vue/no-use-v-if-with-v-for": ["error"],
//         "vue/require-component-is": ["error"],
//         "vue/require-prop-type-constructor": ["error"],
//         "vue/require-render-return": ["error"],
//         "vue/require-v-for-key": ["error"],
//         "vue/require-valid-default-prop": ["error"],
//         "vue/return-in-computed-property": ["error"],
//         "vue/use-v-on-exact": ["error"],
//         "vue/valid-template-root": ["error"],
//         "vue/valid-v-bind": ["error"],
//         "vue/valid-v-cloak": ["error"],
//         "vue/valid-v-else-if": ["error"],
//         "vue/valid-v-else": ["error"],
//         "vue/valid-v-for": ["error"],
//         "vue/valid-v-html": ["error"],
//         "vue/valid-v-if": ["error"],
//         "vue/valid-v-model": ["error"],
//         "vue/valid-v-on": ["error"],
//         "vue/valid-v-once": ["error"],
//         "vue/valid-v-pre": ["error"],
//         "vue/valid-v-show": ["error"],
//         "vue/valid-v-text": ["error"],
//         "vue/comment-directive": ["error"],
//         "vue/jsx-uses-vars": ["error"],
//     },
//     settings: {},
//     ignorePatterns: ["*.config.js", "*.mock.ts"],
// };