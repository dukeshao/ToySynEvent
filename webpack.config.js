const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: "development",
  entry: {
    entry: './entry.jsx'
  },
  devServer: {
    port: 8989,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],//es 高级转低级
            plugins: [
              ["@babel/plugin-transform-react-jsx",
                { pragma: "React.createElement" }
              ]]
          }
        },
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      cache: true
    })
  ]
}