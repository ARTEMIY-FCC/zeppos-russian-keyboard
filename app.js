App({
  package: 'com.example.myapp', // Add the package property
  globalData: {},
  onCreate(options) {
    console.log('app on create invoke')
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})