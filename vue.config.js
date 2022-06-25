module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  configureWebpack: {
    resolve: {
      mainFields: ['main', 'browser']
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
    }
  }
}