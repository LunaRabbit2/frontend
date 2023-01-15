module.exports = {
  pwa: {
    name: 'Lunar Rabbit',
    manifestPath: 'img/icons/site.webmanifest',
    themeColor: '#026B2D',
    msTileColor: '#026B2D',
    manifestOptions: {
      background_color: '#FFFFFF'
    }
  },
  css: { extract: false },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].inject = false;
      return args;
    });
  },
  filenameHashing: false,
}