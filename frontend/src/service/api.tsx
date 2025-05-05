import axios from "axios";

const REACT_APP_API_URL = "http://localhost:5000/api"
// const REACT_APP_API_URL = "https://apicauvang.vuinhungbuon.site/api";
// https://cauvang.huynhvannga.id.vn/
// const REACT_APP_API_URL = "https://apicauvang.huynhvannga.id.vn/api";

const API = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Tự động đính kèm token vào mỗi request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;