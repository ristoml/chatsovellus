import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store.js';
import VueSocketIO from 'vue-socket.io';
import Vuetify from 'vuetify';


//import Axios from 'axios';

Vue.config.productionTip = false;


Vue.use(Vuetify);
import 'vuetify/dist/vuetify.min.css';
import vuetify from './plugins/vuetify';
Vue.use(require('vue-moment'));
Vue.use(new VueSocketIO({
  debug: false,
  connection: 'localhost:3004',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');