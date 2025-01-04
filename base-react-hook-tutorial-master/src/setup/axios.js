import axios from "axios";

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2LCJmdWxsTmFtZSI6ImZpc2FpYm5jYmh4Y2dkZyIsImVtYWlsIjoicnViaW5nb2sxMEBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6IjA5ODY5NTc4OCIsImFkZHJlc3MiOiJxMSwgSENNIiwicm9sZUlEIjoiMSJ9LCJpYXQiOjE3MzUyODkxMjEsImV4cCI6MTczNzg4MTEyMX0.cRWsVXTBE6_Squp4O0r2_5LBbuoCJlgZ6ie2oTzR9rg'; // Lấy token từ cookie hoặc sessionStorage
axios.get('https://can-teen.vercel.app/api/check-auth', {
  headers: {
    Authorization: `Bearer ${token}` // Đính kèm token vào Authorization header
  }
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
// Set config defaults when creating the instance
const instance = axios.create({
    baseURL:   "http://localhost:8080",
  });

instance.defaults.withCredentials = true;
  // Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = process.env.AUTH_TOKEN;

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instance;