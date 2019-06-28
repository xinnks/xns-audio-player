import Vue from 'vue'
import App from './App.vue'
require('./assets/style.scss')

Vue.config.productionTip = false

Vue.filter('doubleDigits', function (val) {
    return val < 10 ? '0' + val : val
})

new Vue({
  render: h => h(App),
}).$mount('#app')
