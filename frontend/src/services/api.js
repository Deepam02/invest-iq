// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL:'https://invest-iq-one.vercel.app/api',
});

export default api;
