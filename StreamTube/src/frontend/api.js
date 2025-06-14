// import axios from "axios";
// // import e from "cors";


// const API_URL = 'https://streamtube-v2gc.onrender.com/api/v1';

// export const api = axios.create({
//     baseURL: API_URL,
//     withCredentials: true,
//     headers:{
//         'Content-Type': 'application/json'
//     },
// });

// api.interceptors.request.use((config)=>{
//     const token = localStorage.getItem('accessToken');
//     console.log('Token from localStorage:', token); 
//     if(token){
//         config.headers.Authorization = `Bearer ${token}`
//         console.log('Authorization header set:', config.headers.Authorization);
//     }
//     return config;
// },
//  (error)=>{
//     console.log(error)
//     return Promise.reject(error)
// }
// )

import axios from "axios";

const API_URL = 'https://streamtube-v2gc.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // exp in seconds
  } catch (e) {
    return true;
  }
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    } else if (token && isTokenExpired(token)) {
      console.warn('Token expired. Removing...');
      localStorage.removeItem('accessToken');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
