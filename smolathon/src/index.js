import React from 'react';
import ReactDOM from 'react-dom/client';
import './static/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// axios config
axios.defaults.baseURL = "http://localhost:8000/api/";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        const refresh = localStorage.getItem('refresh-token');
        if (refresh) {
          try {
            const response = await axios.post("/api/token/refresh/", {
              refresh
            });

            localStorage.setItem('access-token', response.access);

            originalRequest.headers['Authorization'] = `Bearer ${response.access}`;

            return axios(originalRequest);
          } catch (e) {
            localStorage.clear();
            return Promise.reject(e);
          }
        }
      }
    }

    return Promise.reject(error);
  }
)

// rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals(console.log);
