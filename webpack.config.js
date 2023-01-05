const path = require("path");
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV == "production";

const config = {
  output: {
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_PRODUCTION: JSON.stringify(process.env.NODE_ENV === "production")
    })
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  devtool: "source-map"
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
