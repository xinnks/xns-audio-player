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
    if(val < 60){
      return val < 10 ? '0 : 0' + val.toFixed() : '0 : ' + val.toFixed()
    } else {
      let seconds = (val % 60).toFixed() == 60 ? '00' : (val % 60).toFixed()
      let minutes = Math.floor(val/60).toFixed()
      return minutes + ' : ' + (seconds < 10 ? '0' + seconds : seconds)
    }
  }
})

Vue.filter('secsToMinutes', function (val) {
  if(isNaN(val)){
    return (val.toFixed() % 60) + ' : '+ Math.floor(val/60)
  }else{
    return 0
  }
})

new Vue({
  store,
  router,
  render: h => h(Player),
}).$mount('#app')
