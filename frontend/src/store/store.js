import Vue from 'vue';
import Vuex from 'vuex';
// import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);
const getDefaultState = () => {
    return {
        token: '',
        user: {}
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
        }
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_USER: (state, user) => {
            state.user = user;
        },
        RESET: state => {
            Object.assign(state, getDefaultState());
        }
    },
    actions: {
        login: ({ commit, _dispatch }, { token, user }) => {
            commit('SET_USER', user);
            commit('SET_TOKEN', token);
        },
        logout: ({ commit }) => {
            commit('RESET', '');
        }
    }
});