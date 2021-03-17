import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import store  from './store'
// import axios from 'axios'
import {getAxios} from "@/store/api";
import {service as axios} from "@/store/api";

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.prototype.$getAxios = getAxios
axios.defaults.baseURL = 'http://localhost:8080'
// axios.defaults.baseURL = 'http://10.255.17.76:8080'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
