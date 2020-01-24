const path = require('path');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = () => {

  return {
    context: __dirname,
    entry: [
      './basic-fms-info',
      './basic-subsystem',
      './boolean-box',
      //'./camera',
      './combobox-chooser',
      './differential-drivebase',
      //'./encoder',
      './gauge',
      //'./gyro',
      //'./mecanum-drivebase',
      './number-bar',
      './number-slider',
      './relay',
      './text-view',
      './toggle-button',
      './toggle-switch',
      './voltage-view',
    ],
    output: {
      filename: "index.js",
      path: __dirname
    },
    module: {
      rules: [
        {
          test: /\.(jpg|png|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: './images/'
              }
            }
          ]
        },
      ]
    },
    devtool: 'inline-source-map'
  };
}