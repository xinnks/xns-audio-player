// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
require('bulma/css/bulma.min.css')

Vue.config.productionTip = false

Vue.filter('doubleDigits', function (val) {
  return val < 10 ? '0' + val : val
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
