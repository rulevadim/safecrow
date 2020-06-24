const path = require('path');
const { alias, cssVariables, publicDir } = require('./helpers.config');

module.exports = {
  publicPath: process.env.BASE_URL ? process.env.BASE_URL : '/',
  productionSourceMap: false,

  chainWebpack: config => {
    // copy {{partnerDir}}/public to {{project}}/public
    if (process.env.VUE_APP_PARTNER) {
      config.plugin('copy').tap(([pathConfigs]) => {
        const to = pathConfigs[0].to;
        pathConfigs.push({
          from: publicDir,
          to,
          force: true,
        });
        return [pathConfigs];
      });
    }

    // fix on save
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true,
    });

    // for non-breaking space
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(args => {
        args.compilerOptions.whitespace = 'condense';
      });
  },
  configureWebpack: {
    resolve: {
      alias: {
        [alias]: cssVariables,
      },
    },
  },
  devServer: {
    proxy: {
      '^/api': {
        // target: "https://ref.devk8s.safecrow.ru/",
        target: 'https://alfabank.devk8s.safecrow.ru/',
        // target: "https://open.devk8s.safecrow.ru/",
        // target: "https://woodresource.devk8s.safecrow.ru/",
        // target: "http://alfabank-sdelka.ru/",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
