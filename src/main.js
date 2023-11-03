import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLuckyCanvas from '@lucky-canvas/vue'
import '@/assets/font/fontFamily.css'
import VueCookies from 'vue-cookies'

// vant
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
Vue.use(VueCookies)
Vue.use(VueLuckyCanvas);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
