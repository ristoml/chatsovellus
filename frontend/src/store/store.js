import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);
const getDefaultState = () => {
  return {
    token: '',
    user: {},
    chats: null
  };
};
export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    },
    CHATS: state => {
      return state.chats;
    },
    HANDLE: state => {
      return state.user;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_HANDLE: (state, user) => {
      state.user = user;
    },
    ADD_CHAT: (state, payload) => {
      state.chats.push(payload);
    },
    RESET: state => {
      Object.assign(state, getDefaultState());
    },
    SET_CHAT: (state, payload) => {
      state.chats = payload;
    }
  },
  actions: {
    login: ({ commit, _dispatch }, { token, user }) => {
      commit('SET_HANDLE', user);
      commit('SET_TOKEN', token);
    },
    logout: ({ commit }) => {
      commit('RESET', '');
    },
    SET_CHAT: async(context, payload) => {
      let { data } = await Axios.get('/api/chat/');
      console.log(data);
      context.commit('SET_CHAT', data);
    },
    ADD_CHAT: (context, payload) => {
      context.commit('ADD_CHAT', payload);
    },
    SET_HANDLE: (context, payload) => {
      context.commit('SET_HANDLE', payload);
    }
  },

});