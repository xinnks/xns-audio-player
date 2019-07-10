import Vue from 'vue'
import Player from './Player.vue'
import store from './store'
import router from './router'
require('./assets/style.scss')

Vue.config.productionTip = false

Vue.filter('doubleDigits', function (val) {
  if(isNaN(val)){
    return '00'
  }else{
    return val < 10 ? '0' + val : val
  }
})

new Vue({
  store,
  router,
  render: h => h(Player),
}).$mount('#app')
