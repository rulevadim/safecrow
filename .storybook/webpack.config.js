const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (baseConfig, env, defaultConfig) => {
    baseConfig.config.node = {
        fs: "empty",
        global: true,
    };

    baseConfig.config.resolve = {
        modules: ["node_modules", "bower_components"],
        extensions: [".vue", ".ts" , ".js", ".jsx", ".json", "*"],
        alias: {
            vue: "vue/dist/vue.js",
            "@": path.resolve(__dirname, "../src")
        }
    };

    baseConfig.config.module.rules.push({
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
            {
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true
                },
            }
        ],
    });

    baseConfig.config.module.rules.push({
        test: /^[^_].*\.css$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: path.resolve(__dirname, "../")
              },
            },
          },
        ],
        include: path.resolve(__dirname, "../")
    });

    baseConfig.config.module.rules.push({
        test: /\.(ttf|eot|woff|png|otf|svg|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 500000
                }
            }
        ]
    });

    baseConfig.config.plugins.push(new ForkTsCheckerWebpackPlugin());

    return baseConfig.config;
};
