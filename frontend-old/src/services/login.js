import axios from 'axios';
const baseUrl = '/api/login';

let token = null;  // eslint-disable-line no-unused-vars

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const setToken = (userToken) => token = userToken;

const getToken = () => token;

const deleteToken = () => token = null;

export default { login, setToken, deleteToken, getToken };
