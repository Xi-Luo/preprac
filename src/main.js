import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import store  from './store'
import axios from 'axios'

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:8080'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
