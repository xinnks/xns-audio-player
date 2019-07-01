import Vue from 'vue'
import App from './App.vue'
import store from './store'
require('./assets/style.scss')

Vue.config.productionTip = false

Vue.filter('doubleDigits', function (val) {
    return val < 10 ? '0' + val : val
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
