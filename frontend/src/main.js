import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store.js';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const socket = io('localhost:3004', {
  autoConnect: false
});

Vue.use(VueSocketio, socket);

new Vue({
  router,
  store,
  BootstrapVue,
  IconsPlugin,
  render: h => h(App)
}).$mount('#app');