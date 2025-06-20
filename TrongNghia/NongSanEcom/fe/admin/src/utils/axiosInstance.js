import axios from 'axios';

  const token = JSON.parse(localStorage.getItem('adminUser'))?.token;

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export default API;
