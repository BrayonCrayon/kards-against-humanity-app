import axios from "axios";
import { API_URL } from "config";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  withXSRFToken: true
});

apiClient.interceptors.response.use(
  function (response) {
    response.data = response.data.data;
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
