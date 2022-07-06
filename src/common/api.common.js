import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proxyapp.correios.com.br/v1/sro-rastro/',
});

export default api;
