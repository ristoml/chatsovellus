import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    token: '',
    user: {},
    users: [],
    messages: []
  };
};

export default new Vuex.Store({
  strict: true,
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: (state) => {
      return state.token;
    },
    getUser: (state) => {
      return state.user;
    },
    MESSAGES: (state) => {
      return state.messages;
    },
    USER: (state) => {
      return state.user;
    },
    USERS: (state) => {
      return state.users;
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_USERS: (state, users) => {
      state.users = users;
    },
    ADD_MESSAGE: (state, payload) => {
      state.messages.push(payload);
    },
    RESET: (state) => {
      Object.assign(state, getDefaultState());
    },
    SET_MESSAGES: (state, payload) => {
      state.messages = payload.reverse();
    }
  },
  actions: {
    login: ({ commit }, { token, user }) => {
      commit('SET_USER', user);
      commit('SET_TOKEN', token);
    },
    logout: ({ commit }) => {
      commit('RESET', '');
    },
    SET_MESSAGES: async (context) => {
      const { data } = await Axios.get('/api/chat/');
      context.commit('SET_MESSAGES', data);
    },
    ADD_MESSAGE: (context, payload) => {
      context.commit('ADD_MESSAGE', payload);
    },
    SET_USER: (context, payload) => {
      context.commit('SET_USER', payload);
    },
    SET_USERS: (context, payload) => {
      context.commit('SET_USERS', payload);
    }
  },

});
