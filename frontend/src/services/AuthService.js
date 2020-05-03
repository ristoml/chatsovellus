import axios from 'axios';

export default {
  login(credentials) {
    return axios
      .post('/api/login/', credentials)
      .then((response) => response.data);
  },
  signUp(credentials) {
    return axios
      .post('api/users/', credentials)
      .then((response) => response.data);
  }
};
